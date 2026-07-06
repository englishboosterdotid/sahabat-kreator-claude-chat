import { createCanvas } from "@napi-rs/canvas";

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350; // rasio 4:5, standar carousel Instagram

type RenderOptions = {
  backgroundColor?: string;
  textColor?: string;
};

export function renderSlideToPngBuffer(
  text: string,
  slideNumber: number,
  totalSlides: number,
  options: RenderOptions = {}
): Buffer {
  const canvas = createCanvas(SLIDE_WIDTH, SLIDE_HEIGHT);
  const ctx = canvas.getContext("2d");

  const bgColor = options.backgroundColor ?? "#18181B";
  const textColor = options.textColor ?? "#FAFAFA";

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);

  // Teks utama, center, word-wrap sederhana
  ctx.fillStyle = textColor;
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = SLIDE_WIDTH - 160;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = 70;
  const startY = SLIDE_HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, SLIDE_WIDTH / 2, startY + i * lineHeight);
  });

  // Nomor halaman, pojok bawah
  ctx.font = "32px sans-serif";
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.6;
  ctx.fillText(`${slideNumber} / ${totalSlides}`, SLIDE_WIDTH / 2, SLIDE_HEIGHT - 80);
  ctx.globalAlpha = 1;

  return canvas.toBuffer("image/png");
}

function wrapText(ctx: any, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}