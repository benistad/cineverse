import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'MovieHunt';
    const subtitle = searchParams.get('subtitle') || 'Découvrez votre prochain film coup de cœur';
    const rating = searchParams.get('rating');
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b',
            backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: '#4A68D9',
                letterSpacing: '-0.05em',
              }}
            >
              MovieHunt
            </div>
          </div>
          
          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 120px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2,
                marginBottom: 20,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </div>
            
            {/* Rating */}
            {rating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#fbbf24',
                    marginRight: 10,
                  }}
                >
                  ★
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#fbbf24',
                  }}
                >
                  {rating}/10
                </div>
              </div>
            )}
            
            {/* Subtitle */}
            <div
              style={{
                fontSize: 28,
                color: '#94a3b8',
                lineHeight: 1.4,
                maxWidth: '100%',
              }}
            >
              {subtitle}
            </div>
          </div>
          
          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              color: '#64748b',
              fontSize: 20,
            }}
          >
            www.moviehunt.fr
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Erreur génération OG image:', error);
    return new Response('Erreur lors de la génération de l\'image', { status: 500 });
  }
}
