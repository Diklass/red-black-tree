// src/components/TreeCanvas.tsx

import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Tree } from '../tree/Tree';
import { TreeNode } from '../tree/TreeNode';

interface TreeCanvasProps {
  tree: Tree;
}

const TreeCanvas: React.FC<TreeCanvasProps> = ({ tree }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(800, 600);
        p.background(255);
      };

      p.draw = () => {
        p.background(255);
        if (tree.root) {
          drawNode(p, tree.root, 400, 50, 200);
        }
      };
    };

    const canvas = new p5(sketch, wrapperRef.current!);
    return () => canvas.remove();
  }, [tree]);

  return <div ref={wrapperRef} />;
};

function drawNode(p: p5, node: TreeNode, x: number, y: number, offset: number) {
  if (node.left) {
    p.stroke(0);
    p.line(x, y, x - offset, y + 80);
    drawNode(p, node.left, x - offset, y + 80, offset / 2);
  }

  if (node.right) {
    p.stroke(0);
    p.line(x, y, x + offset, y + 80);
    drawNode(p, node.right, x + offset, y + 80, offset / 2);
  }

  p.rectMode(p.CENTER);
  p.fill(node.color === 'RED' ? '#ff5757' : '#2b2b64');
  p.stroke(0);
  p.strokeWeight(3);
  p.rect(x, y, 60, 40, 10); // прямоугольный узел

  p.fill(255);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  p.text(node.value, x, y);
}

export default TreeCanvas;
