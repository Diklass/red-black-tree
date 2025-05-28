// src/tree/Tree.ts
import { TreeNode } from './TreeNode';

export class Tree {
  root: TreeNode | null = null;

  insert(value: number) {
    const newNode = new TreeNode(value);
    this.bstInsert(newNode);
    this.fixInsert(newNode);
  }

  delete(value: number) {
  const node = this.search(this.root, value);
  if (node) {
    this.deleteNode(node);
  }
}
private deleteNode(z: TreeNode) {
  let y = z;
  let yOriginalColor = y.color;
  let x: TreeNode | null;

  let xParent: TreeNode | null = null;

  if (!z.left) {
    x = z.right;
    this.transplant(z, z.right);
    xParent = z.parent;
  } else if (!z.right) {
    x = z.left;
    this.transplant(z, z.left);
    xParent = z.parent;
  } else {
    y = this.minimum(z.right);
    yOriginalColor = y.color;
    x = y.right;

    if (y.parent === z) {
      if (x) x.parent = y;
      xParent = y;
    } else {
      this.transplant(y, y.right);
      y.right = z.right;
      if (y.right) y.right.parent = y;
      xParent = y.parent;
    }

    this.transplant(z, y);
    y.left = z.left;
    if (y.left) y.left.parent = y;
    y.color = z.color;
  }

  if (yOriginalColor === 'BLACK') {
    this.fixDelete(x, xParent);
  }
}

private transplant(u: TreeNode, v: TreeNode | null) {
  if (!u.parent) {
    this.root = v;
  } else if (u === u.parent.left) {
    u.parent.left = v;
  } else {
    u.parent.right = v;
  }

  if (v) v.parent = u.parent;
}

private minimum(node: TreeNode): TreeNode {
  while (node.left) {
    node = node.left;
  }
  return node;
}

private fixDelete(x: TreeNode | null, parent: TreeNode | null) {
  while (x !== this.root && (x === null || x.color === 'BLACK')) {
    if (x === parent?.left) {
      let w = parent.right;

      if (w?.color === 'RED') {
        w.color = 'BLACK';
        parent.color = 'RED';
        this.rotateLeft(parent);
        w = parent.right;
      }

      if ((w?.left?.color ?? 'BLACK') === 'BLACK' && (w?.right?.color ?? 'BLACK') === 'BLACK') {
        if (w) w.color = 'RED';
        x = parent;
        parent = x.parent;
      } else {
        if ((w?.right?.color ?? 'BLACK') === 'BLACK') {
          if (w?.left) w.left.color = 'BLACK';
          if (w) w.color = 'RED';
          if (w) this.rotateRight(w);
          w = parent.right;
        }

        if (w) w.color = parent.color;
        parent.color = 'BLACK';
        if (w?.right) w.right.color = 'BLACK';
        this.rotateLeft(parent);
        x = this.root!;
        break;
      }
    } else {
      let w = parent?.left;

      if (w?.color === 'RED') {
        w.color = 'BLACK';
        parent!.color = 'RED';
        this.rotateRight(parent!);
        w = parent!.left;
      }

      if ((w?.right?.color ?? 'BLACK') === 'BLACK' && (w?.left?.color ?? 'BLACK') === 'BLACK') {
        if (w) w.color = 'RED';
        x = parent!;
        parent = x.parent;
      } else {
        if ((w?.left?.color ?? 'BLACK') === 'BLACK') {
          if (w?.right) w.right.color = 'BLACK';
          if (w) w.color = 'RED';
          if (w) this.rotateLeft(w);
          w = parent!.left;
        }

        if (w) w.color = parent!.color;
        parent!.color = 'BLACK';
        if (w?.left) w.left.color = 'BLACK';
        this.rotateRight(parent!);
        x = this.root!;
        break;
      }
    }
  }

  if (x) x.color = 'BLACK';
}

private search(root: TreeNode | null, value: number): TreeNode | null {
  if (!root || root.value === value) return root;
  if (value < root.value) return this.search(root.left, value);
  else return this.search(root.right, value);
}

  private bstInsert(newNode: TreeNode) {
    if (!this.root) {
      newNode.color = 'BLACK';
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (newNode.value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          newNode.parent = current;
          break;
        } else {
          current = current.left;
        }
      } else {
        if (current.right === null) {
          current.right = newNode;
          newNode.parent = current;
          break;
        } else {
          current = current.right;
        }
      }
    }
  }

  private fixInsert(node: TreeNode) {
    while (node.parent?.color === 'RED') {
      const parent = node.parent;
      const grandparent = parent.parent;

      if (!grandparent) break;

      const isLeft = parent === grandparent.left;
      const uncle = isLeft ? grandparent.right : grandparent.left;

      if (uncle?.color === 'RED') {
        // Перекраска
        parent.color = 'BLACK';
        uncle.color = 'BLACK';
        grandparent.color = 'RED';
        node = grandparent;
      } else {
        if (isLeft) {
          if (node === parent.right) {
            this.rotateLeft(parent);
            node = parent;
          }
          this.rotateRight(grandparent);
        } else {
          if (node === parent.left) {
            this.rotateRight(parent);
            node = parent;
          }
          this.rotateLeft(grandparent);
        }

        parent.color = 'BLACK';
        grandparent.color = 'RED';
      }
    }

    this.root!.color = 'BLACK';
  }

  private rotateLeft(x: TreeNode) {
    const y = x.right!;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;

    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  private rotateRight(y: TreeNode) {
    const x = y.left!;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;

    if (!y.parent) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;
  }
clear() {
  this.root = null;
}
  
}
