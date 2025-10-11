import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Lire l'image depuis le système de fichiers
    const imagePath = path.join(process.cwd(), 'public', 'images', 'og-image.jpg');
    const imageBuffer = fs.readFileSync(imagePath);

    // Retourner l'image avec les bons headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Error serving OG image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}

export const runtime = 'nodejs';
