import { CanvasController } from './others/canvasNavigation.js';
import { GraphController } from "./graph/graphController.js";

const background = document.getElementById('canvas')!;
const canvas = CanvasController.getInstance(background);

const executionController = new GraphController();