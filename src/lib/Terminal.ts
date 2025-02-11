export default class Terminal {
    /// the canvas to draw terminal output to.
    _canvas: HTMLCanvasElement;

    _ctx: CanvasRenderingContext2D;

    /// the number of columns in the terminal
    private _rows!: number;
    
    /// the number of lines in the terminal
    private _cols!: number;

    /// the font that the terminal should use to render
    private _font: string;

    private _fontSize: number;

    private _characterWidth!: number;
    private _characterHeight!: number;

    private _cursorX = 0;
    private _cursorY = 0;

    private _visCursorX = 0;
    private _visCursorY = 0;
    
    private _pixelRatio: number;
    private _backgroundColor: string = "#000000";
    private _foregroundColor: string = "#ffffff";

    private buffer!: string[];
    private visibleBuffer!: string[][];

    private cursorEnabled = true;
    private cursorState = false;

    private cursorFlashInterval?: number;
    
    public set rows(width: number) {
        if (!Number.isInteger(width)) {
            throw new TypeError("Width must be an integer value.");
        }
        this._rows = width;
    }

    public get rows(): number {
        return this._rows;
    }

    public set cols(height: number) {
        if (!Number.isInteger(height)) {
            throw new TypeError("Height must be an integer value.");
        }
        this._cols = height;
    }

    public get cols(): number {
        return this._cols;
    }

    public constructor(canvas: HTMLCanvasElement, pixelRatio: number) {
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d")!;
        this._font = "Consolas";
        this._fontSize = 12;
        this._foregroundColor = "white";
        this._pixelRatio = pixelRatio;
        
        this._ctx.font = `${this._fontSize * pixelRatio}pt ${this._font}`;
        this._ctx.textBaseline = "alphabetic";
        this._ctx.textAlign = "start";
        
        this.calculateCharacterWidth();
        this.calcSize();
        this.createBuffers();
        this.resetCursorInterval();
    }
    
    private createBuffers() {
        this.buffer = [];
        this.visibleBuffer = [];
        for (let i = 0; i < this.rows; i++) {
            this.buffer.push("");
            this.visibleBuffer.push(new Array<string>(this.cols).fill(""));
        }
    }

    public write(text: string) {
        for (const char of text) {
            switch (char) {
                case "\v":
                case "\f":
                case "\n":
                    this.scrollDown();
                    break;
                case "\r":
                    this._visCursorX = 0;
                    break;
                case "\b":
                    this._visCursorX -= 1;
                    if (this._visCursorX < 0) {this._visCursorX = 0};
                    break;
                case "\t":
                    let stop = this.getNextTabStop();
                    let spaceCount = stop - this._visCursorX;
                    console.log(`${this._visCursorX} ${spaceCount}`);
                    if (spaceCount <= 0) break;
                    for (let i = 0; i < spaceCount - 1; i++) {
                        this.write(" ");
                    }

                default:
                    // Write to both the visible buffer and the actual buffer
                    if (this._visCursorX > this._cols) {
                        this.scrollDown();
                    }

                    this.visibleBuffer[this._visCursorY][this._visCursorX] = char;
                    this.buffer[this._cursorX] += char;
                    this._cursorX += 1;
                    this._visCursorX += 1;
            }
        }

        this.drawVisibleBuffer();
        this.resetCursorInterval();
    }

    private scrollDown() {
        this._visCursorY += 1;
        this._visCursorX = 0;

        // wrap the buffer if it overflows
        if (this._visCursorY >= this.rows) {
            this._visCursorY = this.rows - 1;
            this.visibleBuffer.splice(0, 1);
            this.visibleBuffer.push(new Array<string>(this.cols).fill(""));
        }
    }

    private getNextTabStop(): number {
        const tabStop = 6;
        return Math.min(Math.ceil((this._visCursorX + 1) / tabStop) * tabStop, this._cols);
    }

    public drawVisibleBuffer() {
        this._ctx.fillStyle = this._foregroundColor;
        this.clear();
        for (let lineI = 0; lineI < this.visibleBuffer.length; lineI++) {
            let line = this.visibleBuffer[lineI];
            for (let colI = 0; colI < line.length; colI++) {
                let col = line[colI];
                this.draw(col, colI, lineI + 1);
            }
        }
    }

    public draw(char: string, x: number, y: number) {
        this._ctx.fillText(char, x * this._characterWidth, y * this._characterHeight);
    }

    public clear() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    public drawLine(char: string, x: number, y: number) {
        let chars = char.split("");
        for (let i = 0; i < chars.length; i++) {
            this.draw(chars[i], x + i, y + 1);
        }
    }

    public drawCursor(state: boolean) {
        if (!this.drawCursor) return;
        let original = this._ctx.fillStyle;
        this._ctx.fillStyle = `#cccccc`;
        if (state) {
            this._ctx.fillRect(
                this._visCursorX * this._characterWidth,
                this._visCursorY * this._characterHeight,
                this._characterWidth,
                this._characterHeight,
            );
        } else {
            this._ctx.clearRect(this._visCursorX * this._characterWidth,
                this._visCursorY * this._characterHeight,
                this._characterWidth,
                this._characterHeight,
            );
        }

        this._ctx.fillStyle = original;
    }

    public resetCursorInterval() {
        if (!this.cursorEnabled) return;
        window.clearInterval(this.cursorFlashInterval);
        this.cursorState = true;
        this.drawCursor(this.cursorState);
        this.cursorFlashInterval = setInterval(() => {
            this.cursorState = !this.cursorState;
            this.drawCursor(this.cursorState);
        }, 500);
    }

    private calculateCharacterWidth() {
        let measured = this._ctx.measureText("M");
        this._characterWidth = measured.width;
        this._characterHeight = this._fontSize + 10;
    }

    private calcSize() {
        this.cols = Math.floor(this._canvas.width / this._characterWidth) - 1;
        this.rows = Math.floor(this._canvas.height / (this._characterHeight));
    }
}