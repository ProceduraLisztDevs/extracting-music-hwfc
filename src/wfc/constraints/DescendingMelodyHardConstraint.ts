import { OctavedNote } from "../../music_theory/Note"
import { NoteGrabberIR } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"

export const DescendingMelodyHardConstraintInit = {
	type: "DescendingMelodyHardConstraint" as const,
	noteGrabber: "MelodyGrabber" as NoteGrabberIR,
	validByDefault: true as const,
}

export type DescendingMelodyHardConstraintIR =
	typeof DescendingMelodyHardConstraintInit
export class DescendingMelodyHardConstraint implements HardConstraint<OctavedNote> {
	name = noteConstraintTypeToName.get(
		DescendingMelodyHardConstraintInit.type,
	)!.name as string
	constructor() {
	}
    check (tile: Tile<OctavedNote>, _higherValues: HigherValues): boolean {
        const note = tile.getValue()
		const prev = tile.getPrev()
		const next = tile.getNext()

        let res = true;

		if (prev.isCollapsed() && this.isAscending(prev.getValue(), note))
			res = false
		if (next.isCollapsed() && this.isAscending(note, next.getValue()))
			res = false

		return res
    }

	private isAscending(first: OctavedNote, second: OctavedNote): boolean {
		return first.toMIDIValue() < second.toMIDIValue()
	}
	
}
