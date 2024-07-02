import { OctavedNote } from "../../music_theory/Note"
import { Random } from "../../util/Random"
import { HigherValues } from "../HigherValues"
import { TileCanvas, TileCanvasProps } from "../TileCanvas"


export class NoteLevelNode {
	private canvas: TileCanvas<OctavedNote>

	constructor(
		
		higherValues: HigherValues,
		random: Random,
		canvasProps?: TileCanvasProps<OctavedNote>,
		canvas?: TileCanvas<OctavedNote>
	) {
		if (!canvasProps && !canvas) {
			throw new Error("At least one of canvasProps or canvas must be provided.");
		}

		if (canvas) {
			this.canvas = canvas;
		} else {
			this.canvas = new TileCanvas<OctavedNote>(
				higherValues.melodyLength,
				canvasProps!,
				higherValues,
				random,
			);
		}
		
	}

	
	public generate(): OctavedNote[] {
		return this.canvas.generate()
	}
}
