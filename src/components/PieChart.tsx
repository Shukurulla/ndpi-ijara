"use client";
import { useEffect, useRef } from "react";
import type { TutorStatistics } from "@/types";

interface PieChartProps {
  statistics: TutorStatistics | null;
  size?: number;
}

export default function PieChart({ statistics, size = 200 }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !statistics) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    const getCount = (s: any) => s?.total ?? s?.count ?? s ?? 0;
    
    // Flutter exact colors
    const segments = [
      { value: getCount(statistics.green), color: "#22C55E" },  // statusGreen
      { value: getCount(statistics.yellow), color: "#F59E0B" }, // statusYellow
      { value: getCount(statistics.red), color: "#EF4444" },    // statusRed
      { value: getCount(statistics.blue), color: "#3B82F6" },   // statusBlue
    ];

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#E0E0E0";
      ctx.fill();
      
      // Inner circle for donut effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      return;
    }

    let startAngle = -Math.PI / 2;
    segments.forEach((segment) => {
      if (segment.value > 0) {
        const sliceAngle = (segment.value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        startAngle += sliceAngle;
      }
    });

    // Inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Center text
    ctx.fillStyle = "#1A1A2E";
    ctx.font = "bold 24px Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toString(), centerX, centerY - 8);
    
    ctx.fillStyle = "#9E9E9E";
    ctx.font = "12px Roboto, sans-serif";
    ctx.fillText("Jami", centerX, centerY + 12);
  }, [statistics, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
