import { chordResultToOutput, chordResultWithRhythmToOutput } from "../../audio/midi"
import { NoteOutput } from "../../components/MidiPlayer"
import { OctavedNote } from "../../music_theory/Note"
import { getRandomRhythmPattern } from "../../music_theory/Rhythm"
import { Random } from "../../util/Random"
import { HigherValues } from "../HigherValues"
import { TileCanvasProps, TileCanvas, unionOfTileCanvasProps } from "../TileCanvas"
import { NoteLevelNode } from "./NoteLevelNode"
import { ChordPrototype, Chordesque } from "./Chordesque"


interface ChordLevelNodeProps {
	higherValues: HigherValues
	noteCanvasProps: TileCanvasProps<OctavedNote>
	chordesqueCanvasProps: TileCanvasProps<Chordesque>
	random: Random
}

export class ChordLevelNode {
	private higherValues: HigherValues
	private noteCanvasProps: TileCanvasProps<OctavedNote>
	private chordesqueCanvas: TileCanvas<Chordesque>
	private random: Random
	private noteLevelNodes: Map<Chordesque,NoteLevelNode>
	constructor(props: ChordLevelNodeProps) {
		this.higherValues = props.higherValues 
		this.noteCanvasProps = props.noteCanvasProps
		console.log(this.higherValues.numChords,
			props.chordesqueCanvasProps,
			this.higherValues,
			props.random,)
		this.chordesqueCanvas = new TileCanvas(
			this.higherValues.numChords,
			props.chordesqueCanvasProps,
			this.higherValues,
			props.random,
		)
		this.random = props.random
		this.noteLevelNodes = new Map<Chordesque,NoteLevelNode>
	}
	public getHigherValues(): HigherValues {
		return this.higherValues
	}

	public getNoteCanvasProps(): TileCanvasProps<OctavedNote> {
		return this.noteCanvasProps
	}

	public getChordesqueCanvas(): TileCanvas<Chordesque> {
		return this.chordesqueCanvas
	}
 
	public getRandom(): Random {
		return this.random
	}

	public getNoteLevelNodes(): Map<Chordesque,NoteLevelNode>{
		return this.noteLevelNodes
	}


	
	
	public  generate(): [NoteOutput[], number] {
		//console.log("check" + this.chordesqueCanvas.getTiles())

		const chords = this.chordesqueCanvas.generate()
		console.log("chordesqueSize" + chords.length)
		let offset = 0
		const out: NoteOutput[] = []
		for (const chord of chords) {
			const chordValue = chord.getChord()
			let actualNoteCanvasProps = this.noteCanvasProps
			let actualMelodyLength = this.higherValues.melodyLength
			let rhythmPatternOptions = this.higherValues.rhythmPatternOptions
			
			if (chord instanceof ChordPrototype) {
				actualNoteCanvasProps = unionOfTileCanvasProps (
					this.noteCanvasProps, 
					chord.noteCanvasProps,
				)
				if (chord.melodyLengthStrategy === "Custom") actualMelodyLength = chord.melodyLength
				if (chord.rhythmStrategy === "On") rhythmPatternOptions = chord.rhythmPatternOptions
			}

			const chordHasPreference =
				chord instanceof ChordPrototype &&
				(chord.rhythmStrategy === "On" ||
					chord.rhythmStrategy === "Off")

			const useRhythm = chordHasPreference
				? chord.rhythmStrategy === "On"
				: this.higherValues.useRhythm

			const newHigherValues: HigherValues = {...{...this.higherValues, chord: chordValue, useRhythm},
				...(chord instanceof ChordPrototype ? {
					rhythmPatternOptions: chord.rhythmPatternOptions,
					melodyLength: chord.melodyLength,
					bpm: chord.bpmStrategy === "Custom" ? chord.bpm : this.higherValues.bpm,
				} : {})
			}

			const noteLevelNode = new NoteLevelNode(
				
				newHigherValues,
				this.random,
				actualNoteCanvasProps
			)

			const abstractResultBase = {
				chord: chordValue,
				notes: noteLevelNode.generate()
			}
			this.noteLevelNodes.set(chord, noteLevelNode)
			if(useRhythm) {
				const abstractResult = {
					...abstractResultBase,
					rhythmPattern: getRandomRhythmPattern(
						actualMelodyLength,
						rhythmPatternOptions,
						this.random,
					)
				}

				const [subResult, newOffset] = chordResultWithRhythmToOutput(
					abstractResult,
					this.higherValues.bpm,
					offset,
				)
				out.push(...subResult)
				offset = newOffset
				
			} else {
				const [subResult, newOffset] = chordResultToOutput(
					abstractResultBase,
					this.higherValues.bpm,
					offset,
				)
				out.push(...subResult)
				offset = newOffset
			}
		}

		return [out, offset]
	}



	public  uploadGenerate(): [NoteOutput[], number] {
		const chords = this.chordesqueCanvas.generate()

		let offset = 0
		const out: NoteOutput[] = []
		for (const chord of chords) {
			const chordValue = chord.getChord()
			let actualNoteCanvasProps = this.noteCanvasProps
			let actualMelodyLength = this.higherValues.melodyLength
			let rhythmPatternOptions = this.higherValues.rhythmPatternOptions
			
			if (chord instanceof ChordPrototype) {
				actualNoteCanvasProps = unionOfTileCanvasProps (
					this.noteCanvasProps, 
					chord.noteCanvasProps,
				)
				if (chord.melodyLengthStrategy === "Custom") actualMelodyLength = chord.melodyLength
				if (chord.rhythmStrategy === "On") rhythmPatternOptions = chord.rhythmPatternOptions
			}

			const chordHasPreference =
				chord instanceof ChordPrototype &&
				(chord.rhythmStrategy === "On" ||
					chord.rhythmStrategy === "Off")

			const useRhythm = chordHasPreference
				? chord.rhythmStrategy === "On"
				: this.higherValues.useRhythm

			const newHigherValues: HigherValues = {...{...this.higherValues, chord: chordValue, useRhythm},
				...(chord instanceof ChordPrototype ? {
					rhythmPatternOptions: chord.rhythmPatternOptions,
					melodyLength: chord.melodyLength,
					bpm: chord.bpmStrategy === "Custom" ? chord.bpm : this.higherValues.bpm,
				} : {})
			}

			const noteLevelNode = new NoteLevelNode(
				
				newHigherValues,
				this.random,
				actualNoteCanvasProps
			)

			const abstractResultBase = {
				chord: chordValue,
				notes: noteLevelNode.generate()
			}
			this.noteLevelNodes.set(chord, noteLevelNode)
			if(useRhythm) {
				const abstractResult = {
					...abstractResultBase,
					rhythmPattern: getRandomRhythmPattern(
						actualMelodyLength,
						rhythmPatternOptions,
						this.random,
					)
				}

				const [subResult, newOffset] = chordResultWithRhythmToOutput(
					abstractResult,
					this.higherValues.bpm,
					offset,
				)
				out.push(...subResult)
				offset = newOffset
				
			} else {
				const [subResult, newOffset] = chordResultToOutput(
					abstractResultBase,
					this.higherValues.bpm,
					offset,
				)
				out.push(...subResult)
				offset = newOffset
			}
		}

		return [out, offset]
	}
}
