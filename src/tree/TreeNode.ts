// src/tree/TreeNode.ts

export type Color = 'RED' | 'BLACK';

export class TreeNode {
  value: number;
  color: Color;
  left: TreeNode | null;
  right: TreeNode | null;
  parent: TreeNode | null;
  x: number | undefined;
  y: number | undefined;

  constructor(value: number) {
    this.value = value;
    this.color = 'RED';
    this.left = null;
    this.right = null;
    this.parent = null;
  }

  isRed(): boolean {
    return this.color === 'RED';
  }

  isBlack(): boolean {
    return this.color === 'BLACK';
  }
}
