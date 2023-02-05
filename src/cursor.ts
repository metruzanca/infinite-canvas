/* Bit buggy, but good enough */
export class Cursor {
  constructor(
    private style: CSSStyleDeclaration,
    private initial = 'initial'
  ) {}

  cursorStack: string[] = []
  change(icon?: string) {
    if (icon) {
      this.cursorStack.push(icon)
      this.style.cursor = icon;
    } else {
      this.cursorStack.pop()
      this.style.cursor = this.cursorStack[this.cursorStack.length - 1] || this.initial
    }
  }
}
