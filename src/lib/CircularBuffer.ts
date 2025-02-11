export default class CircularBuffer<T> {
    private buff: T[];
    private _size!: number;
    private index: number;

    public constructor(size: number) {
        this.size = size;
        this.buff = [];
        this.index = 0;
    }

    public set size(size: number) {
        if (!Number.isInteger(size)) {
            throw new TypeError("Size must be an integer value.");
        }
        this._size = size;
    }

    public get size(): number {
        return this._size;
    }

    public at(index: number): T | undefined {
        if (index >= this._size) return undefined;
        return this.buff.at(index);
    }

    public set(index: number, value: T) {
        this.buff[index] = value;
    }

    public clear() {
        this._size = 0;
        this.index = 0;
    }

    public push(value: T) {
        this.buff[this.index++] = value;
        if (this.index >= this.size) {
            this.index = 0;
        }
    }
}