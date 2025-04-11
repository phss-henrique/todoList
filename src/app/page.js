'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:3001/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    });
    setNewTodo('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editingText }),
    });
    setEditingId(null);
    fetchTodos();
  };

  return (
    <main className="flex flex-col items-center justify-start p-10 gap-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tarefas 📝</h1>

      <div className="flex w-full gap-2">
        <Input
          placeholder="Nova tarefa..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button onClick={addTodo}>Adicionar</Button>
      </div>

      <ul className="w-full flex flex-col gap-3">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            {editingId === todo.id ? (
              <>
                <Input
                  className="flex-1"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <Button variant="outline" onClick={() => saveEdit(todo.id)}>Salvar</Button>
              </>
            ) : (
              <>
                <span className="flex-1">{todo.text}</span>
                <Button variant="outline" onClick={() => startEdit(todo)}>Editar</Button>
              </>
            )}
            <Button
              variant="destructive"
              onClick={() => deleteTodo(todo.id)}
            >
              Remover
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
