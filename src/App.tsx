import { useState } from 'react';
import './App.css';
import TreeCanvas from './components/TreeCanvas';
import { Tree } from './tree/Tree';
import { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
const tree = new Tree();

function App() {
  const [value, setValue] = useState('');
  const [, rerender] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(true);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const logRef = useRef<HTMLDivElement | null>(null);
const isDragging = useRef(false);
const offset = useRef({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !logRef.current) return;

    const newX = e.pageX - offset.current.x;
    const newY = e.pageY - offset.current.y;
    setPosition({ x: newX, y: newY });
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}, []);

  const handleInsert = () => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      tree.insert(num);
      setLogs(prev => [`Вставка ${num}`, ...prev]);
      setValue('');
      rerender(n => n + 1);
    }
  };

  const handleDelete = () => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      tree.delete(num);
      setLogs(prev => [`Удаление ${num}`, ...prev]);
      setValue('');
      rerender(n => n + 1);
    }
  };

  const handleClear = () => {
    tree.clear();
    setLogs(prev => ['Очистка дерева', ...prev]);
    rerender(n => n + 1);
  };

  const handleGenerateRandom = () => {
    tree.clear();
    const randomValues = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 500)
    );
    randomValues.forEach((v) => tree.insert(v));
    setLogs(prev => [`Генерация случайного дерева: ${randomValues.join(', ')}`, ...prev]);
    rerender(n => n + 1);
  };

  const handleSaveCanvas = () => {
  const canvasElement = document.querySelector('canvas') as HTMLCanvasElement;
  if (!canvasElement) return;

  const image = canvasElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'red-black-tree.png';
  link.href = image;
  link.click();
};

  return (
    <div className="page-wrapper">
      <div className="app-wrapper">
        <h1>🌳 Красно-черное дерево</h1>
        <div className="button-panel">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={handleInsert}>
            <span className="button_top">Вставить</span>
          </button>
          <button onClick={handleDelete}>
            <span className="button_top">Удалить</span>
          </button>
          <button onClick={handleClear}>
            <span className="button_top">Очистить</span>
          </button>
          <button onClick={handleGenerateRandom}>
            <span className="button_top">Случайное дерево</span>
          </button>
        </div>
        <button onClick={handleSaveCanvas}>
          <span className="button_top">Сохранить как изображение</span>
        </button>

        <div className="canvas-wrapper">
          <TreeCanvas tree={tree} />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setShowLog(prev => !prev)}>
            <span className="button_top">
              {showLog ? 'Скрыть лог' : 'Показать лог'}
            </span>
          </button>

         {showLog && (
        <div
          className="floating-log"
          ref={logRef}
          style={{
            left: position.x,
            top: position.y,
            position: 'absolute',
            zIndex: 9999,
          }}
        >
          <div
            className="log-header"
            onMouseDown={(e) => {
              if (!logRef.current) return;
              isDragging.current = true;
              offset.current = {
                x: e.pageX - logRef.current.offsetLeft,
                y: e.pageY - logRef.current.offsetTop,
              };
            }}
          >
            <strong>Журнал операций</strong>
            <button onClick={() => setShowLog(false)} style={{ float: 'right' }}>✖</button>
          </div>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>🔹 {log}</li>
            ))}
          </ul>
        </div>
              )}
        </div>
      </div>
    </div>
  );
}

export default App;
