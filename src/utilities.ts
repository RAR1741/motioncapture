import * as poseDetection from '@tensorflow-models/pose-detection';

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

function drawKeypoint(
    keypoint: poseDetection.Keypoint, ctx: CanvasRenderingContext2D): void {
  const circle = new Path2D();
  circle.arc(keypoint.x, keypoint.y, 4 /* radius */, 0 /* startAngle */, 2 * Math.PI);
  ctx.fill(circle);
  ctx.stroke(circle);
}

function drawSkeleton(
    keypoints: poseDetection.Keypoint[], model: poseDetection.SupportedModels.BlazePose,
    ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const pairs = poseDetection.util.getAdjacentPairs(model);
  for (const pair of pairs) {
    const [i, j] = pair;
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];

    ctx.beginPath();
    ctx.moveTo(kp1.x, kp1.y);
    ctx.lineTo(kp2.x, kp2.y);
    ctx.stroke();
  }
}

function draw(
    keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D,
    model: poseDetection.SupportedModels.BlazePose, color: string) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  for (const keypoint of keypoints) {
    drawKeypoint(keypoint, ctx);
  }
  drawSkeleton(keypoints, model, ctx, color);
}