import { OctavedNote } from "../../music_theory/Note"
import { NoteGrabberIR } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"

export const AscendingMelodyHardConstraintInit = {
	type: "AscendingMelodyHardConstraint" as const,
	noteGrabber: "MelodyGrabber" as NoteGrabberIR,
	validByDefault: true as const,
}

export type AscendingMelodyHardConstraintIR =
	typeof AscendingMelodyHardConstraintInit
export class AscendingMelodyHardConstraint implements HardConstraint<OctavedNote> {
	name = noteConstraintTypeToName.get(
		AscendingMelodyHardConstraintInit.type,
	)!.name as string
	constructor() {
	}
    check (tile: Tile<OctavedNote>, _higherValues: HigherValues): boolean {
        const note = tile.getValue()
		const prev = tile.getPrev()
		const next = tile.getNext()

        let res = true;

		if (prev.isCollapsed() && this.isDescending(prev.getValue(), note))
			res = false
		if (next.isCollapsed() && this.isDescending(note, next.getValue()))
			res = false

		return res
    }

	
	private isDescending(first: OctavedNote, second: OctavedNote): boolean {
		return first.toMIDIValue() > second.toMIDIValue()
	}
}
