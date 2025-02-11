<script lang="ts">
    import Terminal from "$lib/Terminal";
    import { onMount } from "svelte";
    let canvas: HTMLCanvasElement;
    let renderer: Terminal | null = null;
    
    onMount(() => {
        canvas.height = 600;
        canvas.width = 900;
        renderer = new Terminal(canvas, window.devicePixelRatio);

        canvas.style.height = `${canvas.height / window.devicePixelRatio}px`;
        canvas.style.width = `${canvas.width / window.devicePixelRatio}px`;

        renderer.write("\\n - newline:\nHello,\nworld!\n\n");
        renderer.write("\\r - carriage return:\nHello,\rworld!\n\n");
        renderer.write("\\t - tab:\nHello,\tworld!\n\n");
        renderer.write("\\b - backspace:\nHello,\bworld!\n\n");



        renderer.write("== \\t test ==\n");
        renderer.write("1\t2\t3\t4\t5\t6\t7\t8\t9\t0\t1\t2\t3\t4\t5\t6");
        renderer.write("\n\n");
        renderer.write("Heading:\n\t- item 1\n\t- item 2\n\t\t- sub-item 1\n\t\t- sub-item 2")
    });

    function keydown(ev: KeyboardEvent) {
        // renderer!.write(getKeyCharacterFromAsciiValue(ev)!);
    }

    function getKeyCharacterFromAsciiValue(event: KeyboardEvent) {
        const key = event.key;

        // For printable characters, return the key itself
        if (key.length === 1) {
            return key; // Printable character
        }

        // For non-printable keys, return the character associated with their ASCII value
        switch (key) {
            case 'Enter':
                return "\r\n";
            case 'Escape':
                return String.fromCharCode(27);  // Escape (ESC)
            case 'Backspace':
                return "\b \b";   // Backspace
            case 'Shift':
                return "";
            case 'Tab':
                event.preventDefault();
                return String.fromCharCode(9);   // Horizontal Tab
            case 'ArrowUp':
                return String.fromCharCode(38);  // Arrow Up (not really printable, just for example)
            case 'ArrowDown':
                return String.fromCharCode(40);  // Arrow Down (not really printable, just for example)
            case 'ArrowLeft':
                return String.fromCharCode(37);  // Arrow Left (not really printable, just for example)
            case 'ArrowRight':
                return String.fromCharCode(39);  // Arrow Right (not really printable, just for example)
            default:
                return String.fromCharCode(63); // For other keys that don't have a visible character representation
        }
    }

</script>

<svelte:window on:keydown={(ev) => keydown(ev)} />

<div class="flex items-center justify-center h-screen w-screen bg-zinc-800">
    <div class="bg-white rounded-md shadow-2xl">
        <h1 class="font-mono text-md px-2 text-neutral-800 from-purple-700 to-purple-500 bg-gradient-to-tr rounded-t-md">
            weter 
            <span class="text-neutral-400">|</span>
            <span class="text-purple-100 italic">web-based terminal renderer</span>
        </h1>
    <canvas class="bg-neutral-900 rounded-b-md p-2" bind:this={canvas}></canvas>
    </div> 
</div>