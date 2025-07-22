'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  order: number;
}

const priorityColors: Record<string, string> = {
  High: 'bg-red-500 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white',
};

interface DraggableCardProps {
  id: string;
  task: Task;
}

export function DraggableCard({ id, task }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{task.description}</p>
          <p>📅 {task.date}</p>
          <div className="flex flex-wrap gap-1">
            {task.tags.map((t, i) => (
              <Badge key={i}>{t}</Badge>
            ))}
          </div>
          <span className={`px-2 py-1 rounded ${priorityColors[task.priority] || 'bg-gray-200 text-black'}`}>
            {task.priority}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
