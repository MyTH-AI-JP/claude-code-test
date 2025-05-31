import { GameObject } from '@/types/game';

export const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  return (
    obj1.position.x < obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width > obj2.position.x &&
    obj1.position.y < obj2.position.y + obj2.height &&
    obj1.position.y + obj1.height > obj2.position.y
  );
};

export const isOutOfBounds = (obj: GameObject, canvasWidth: number, canvasHeight: number): boolean => {
  return (
    obj.position.x < 0 ||
    obj.position.x + obj.width > canvasWidth ||
    obj.position.y < 0 ||
    obj.position.y > canvasHeight
  );
};