import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Newsletter } from '../types';

interface InfographicCanvasProps {
  newsletter: Newsletter;
}

export const InfographicCanvas: React.FC<InfographicCanvasProps> = ({ newsletter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas dimensions: 800 x 1200
    canvas.width = 800;
    canvas.height = 1100;

    // 1. Background (Warm Cream #FDFBF7 with subtle gradient)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1100);
    bgGradient.addColorStop(0, '#FFFFFF');
    bgGradient.addColorStop(0.3, '#FDFBF7');
    bgGradient.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 1100);

    // Decorative outer border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, 768, 1068);

    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, 748, 1048);

    // 2. Header Bar
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(40, 45, 720, 95);

    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WORD EMBASSY DIGITAL INFOGRAPHIC', 400, 78);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Bible Teaching • Faith • Prayer • Christian Living', 400, 105);

    // 3. Title & Theme
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((newsletter.Theme || 'SPIRITUAL DEVOTIONAL').toUpperCase(), 400, 180);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
    ctx.fillText(newsletter.Title, 400, 220);

    // 4. Scripture Block
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(60, 255, 680, 110);
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 255, 680, 110);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`KEY SCRIPTURE: ${newsletter.ScriptureReference.toUpperCase()}`, 400, 285);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'italic 16px "Source Serif 4", Georgia, serif';
    const scriptureWords = `"${newsletter.ScriptureText}"`.split(' ');
    let line = '';
    let y = 315;
    for (let n = 0; n < scriptureWords.length; n++) {
      const testLine = line + scriptureWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 620 && n > 0) {
        ctx.fillText(line, 400, y);
        line = scriptureWords[n] + ' ';
        y += 24;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // 5. 3 Transformative Pillars
    const points = [
      { num: '01', title: newsletter.KeyPoint1Title, body: newsletter.KeyPoint1Body },
      { num: '02', title: newsletter.KeyPoint2Title, body: newsletter.KeyPoint2Body },
      { num: '03', title: newsletter.KeyPoint3Title, body: newsletter.KeyPoint3Body },
    ];

    let cardY = 400;
    points.forEach((p) => {
      // Card box
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(60, cardY, 680, 125);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(60, cardY, 680, 125);

      // Number badge
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(80, cardY + 20, 44, 44);
      ctx.fillStyle = '#FEF3C7';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.num, 102, cardY + 48);

      // Point Title
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 17px "Playfair Display", Georgia, serif';
      ctx.fillText(p.title || 'Key Principle', 140, cardY + 42);

      // Point Body
      ctx.fillStyle = '#475569';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      const bodyWords = (p.body || '').split(' ');
      let bLine = '';
      let bY = cardY + 68;
      for (let w = 0; w < bodyWords.length; w++) {
        const testB = bLine + bodyWords[w] + ' ';
        if (ctx.measureText(testB).width > 560 && w > 0) {
          ctx.fillText(bLine, 140, bY);
          bLine = bodyWords[w] + ' ';
          bY += 20;
          if (bY > cardY + 115) break;
        } else {
          bLine = testB;
        }
      }
      ctx.fillText(bLine, 140, bY);

      cardY += 140;
    });

    // 6. Actionable Takeaway Box
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(60, 840, 680, 140);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 840, 680, 140);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PRACTICAL FAITH IN ACTION', 400, 870);

    ctx.fillStyle = '#334155';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    const appLines = (newsletter.PracticalApplication || '')
      .split('\n')
      .slice(0, 3);
    appLines.forEach((l, i) => {
      ctx.fillText(l.substring(0, 85), 400, 902 + i * 22);
    });

    // 7. Footer
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('www.wordembassy.org • Free Weekly Christian Publication', 400, 1025);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Share this visual summary with friends & family to encourage their faith today.', 400, 1050);

    setDownloadUrl(canvas.toDataURL('image/png'));
  }, [newsletter]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Word-Embassy-Infographic-${newsletter.Slug}.png`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm my-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309] uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            <span>Infographic Study Summary</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1E293B] mt-0.5">
            Visual Biblical Teaching Card
          </h3>
        </div>
        <button
          onClick={handleDownload}
          className="bg-[#1E293B] hover:bg-[#334155] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors self-stretch sm:self-auto justify-center"
          id="download-infographic-btn"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res PNG</span>
        </button>
      </div>

      <div className="flex justify-center bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[500px] h-auto rounded-lg shadow-md border border-slate-200 bg-white"
        />
      </div>
    </div>
  );
};
