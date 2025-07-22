"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { useSupabase } from "@/components/SupabaseProvider";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { DraggableCard } from "@/components/DraggableCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Bell, Plus, User, Moon, Sun } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  priority: "High" | "Medium" | "Low";
  order: number;
}

export default function HomePage() {
  const { supabase, session } = useSupabase();
  const { theme, setTheme } = useTheme();

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    tags: "",
    priority: "Low",
  });
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<"date" | "priority">("date");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (!session) return;
    supabase
      .from<Task>("tasks")
      .select("*")
      .order("order", { ascending: true })
      .then((res) => {
        if (res.data) setTasks(res.data);
      });

    const channel = supabase
      .channel("tasks-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          supabase
            .from<Task>("tasks")
            .select("*")
            .order("order", { ascending: true })
            .then((res) => {
              if (res.data) setTasks(res.data);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase]);

  const signIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    setLoading(false);
    if (error) setErrorMsg(error.message);
  };

  const signUp = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    setLoading(false);
    if (error) setErrorMsg(error.message);
  };

  const addTask = async () => {
    const newTask = {
      title: form.title,
      description: form.description,
      date: form.date,
      tags: form.tags.split(",").map((t) => t.trim()),
      priority: form.priority,
      order: tasks.length,
      user_id: session!.user.id,
    };
    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      alert("Error adding task: " + error.message);
      return;
    }

    setTasks((prev) => [...prev, data]);
    setOpen(false);
    setForm({
      title: "",
      description: "",
      date: "",
      tags: "",
      priority: "Low",
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newOrder.map((t, i) => ({ ...t, order: i })));

      await Promise.all(
        newOrder.map((t) =>
          supabase.from("tasks").update({ order: t.order }).eq("id", t.id)
        )
      );
    }
  };

  const filtered = useMemo(() => {
    let arr = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(filter.toLowerCase()) ||
        t.description.toLowerCase().includes(filter.toLowerCase())
    );
    if (sortKey === "date")
      arr = arr.sort((a, b) => a.date.localeCompare(b.date));
    if (sortKey === "priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      arr = arr.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    return arr;
  }, [tasks, filter, sortKey]);

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Title", "Description", "Date", "Tags", "Priority"]],
      body: filtered.map((t) => [
        t.title,
        t.description,
        t.date,
        t.tags.join(", "),
        t.priority,
      ]),
    });
    doc.save("tasks.pdf");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 space-y-4">
          <CardHeader>
            <CardTitle>Sign In or Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <Input
              placeholder="Email"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={signIn} disabled={loading} className="flex-1">
                {loading ? "Signing In…" : "Sign In"}
              </Button>
              <Button
                variant="outline"
                onClick={signUp}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Signing Up…" : "Sign Up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${theme === "light" ? "bg-white text-black" : "bg-gradient-to-br from-purple-900 via-black to-black text-white"}`}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-3xl font-bold">Task List</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Bell />
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User />
          </div>
          <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as any)}
          className="p-2 rounded bg-white dark:bg-zinc-800 text-black dark:text-white"
        >
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
        <CSVLink data={filtered} filename="tasks.csv">
          <Button>Export CSV</Button>
        </CSVLink>
        <Button onClick={exportPDF}>Export PDF</Button>
      </div>

      <Button onClick={() => setOpen(true)} className="mb-4 flex items-center">
        <Plus className="mr-2" /> Add Task
      </Button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filtered.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((task) => (
              <DraggableCard key={task.id} id={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
            <Select
              value={form.priority}
              onValueChange={(value) => setForm({ ...form, priority: value })}
            >
              <SelectTrigger className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={addTask}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
