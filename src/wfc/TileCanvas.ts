import { Random } from "../util/Random"
import { ConstraintSet } from "./ConstraintSet"
import { HigherValues } from "./HigherValues"
import { OptionsPerCell } from "./OptionsPerCell"
import { Tile } from "./Tile"
import { TileSelector } from "./TileSelector"


export interface TileCanvasProps<T> {
	optionsPerCell: OptionsPerCell<T>
	constraints: ConstraintSet<T>
}

export const unionOfTileCanvasProps = <T>(first: TileCanvasProps<T>, second: TileCanvasProps<T>) => {
	return {
		optionsPerCell: first.optionsPerCell.union(second.optionsPerCell),
		constraints: first.constraints.union(second.constraints),
	}
}

const optionsToWeighedOptions = <T>(options: Set<T>): Set<[T, number]> => {
	return new Set([...options].map((option: T) => [option, 1]))
}

export class TileCanvas<T> {
	private size: number
	private collapsed: number
	private tiles: Tile<T>[]
	private pq: TileSelector<T>
	private random: Random
	private higherValues: HigherValues
	private constraints: ConstraintSet<T>
	private measure?: number
	public getSize(): number {
		return this.size
	}

	constructor(
		size: number,
		props: TileCanvasProps<T>,
		higherValues: HigherValues,
		random: Random,
		measure?: number
	) {
		this.size = size
		this.collapsed = 0
		this.measure = measure
		const optionsPerCell = props.optionsPerCell

		this.pq = new TileSelector<T>(random)
		this.random = random
		this.higherValues = higherValues
		this.constraints = props.constraints

		this.tiles = [this.createTile(optionsPerCell, 0)]

		for (let i = 1; i < this.size; i++) {
			const tile = this.createTile(optionsPerCell, i)
			
			this.tiles[i - 1].setNext(tile)

			this.tiles.push(tile)
		}
		console.log(this)
		//console.log("tiles:" + this.tiles.length)
		//console.log("size:" + this.size)
		this.tiles[this.size - 1].setNext(Tile.trailer(this))

		this.tiles.forEach((tile) => {
			tile.updateOptions()
			this.pq.add(tile)
		})
	}

	private createTile(optionsPerCell: OptionsPerCell<T>, i: number) {
		const options = optionsPerCell.getOptions(i)
		let status
		if (options.length === 1) {
			this.collapsed++
			status = options[0]
		} else {
			status = optionsToWeighedOptions(new Set(options))
		}
		return new Tile<T>({
			status,
			canvas: this,
			position: i,
			prev: i === 0 ? Tile.header(this) : this.tiles[i - 1],
		})
	}
	public getTiles(): Tile<T>[] {
		return this.tiles
	}
	public getConstraints(): ConstraintSet<T> {
		return this.constraints
	}

	public getHigherValues(): HigherValues {
		return this.higherValues
	}

	public collapseOne(): number {
		return ++this.collapsed
	}

	public addTileOption(tile: Tile<T>) {
		this.pq.add(tile)
	}

	public getRandom(): Random {
		return this.random
	}
	public getMeasure(): number {
		return this.measure!
	}

	public collapseNext(): Tile<T> {
		if (this.collapsed >= this.size) throw new Error("Nothing to collapse")
		const tileToCollapse = this.pq.poll()
		tileToCollapse.collapse()
		return tileToCollapse
	}
	

	public generate(): T[] {
		while (this.collapsed < this.size) this.collapseNext()
		//console.log(this.constraints)
		console.log(this.tiles)
		console.log(this.constraints)
		//const constraintHierarchy: ConstraintHierarchy<T> = new ConstraintHierarchy<T>(this.higherValues)
	//	console.log(constraintHierarchy.checkConstraintsGeneric(this.constraints, this.tiles))
		return this.tiles.map((tile) => tile.getValue())
	}
}
