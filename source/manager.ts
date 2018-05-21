
import * as uuid from "uuid/v4"

import {Entity} from "./entity"
import {State, StateEntry} from "./interfaces"

/**
 * MANAGER CLASS
 *  - public access to administrative game functions
 *  - entities have access to this via context
 */
export class Manager {
	private readonly state: State
	private readonly entities: Map<string, Entity>

	constructor({state, entities}) {
		Object.assign(this, {state, entities})
	}

	getEntities(): Entity[] {
		return Array.from(this.entities).map(([id, entity]) => entity)
	}

	addEntry<T extends StateEntry = StateEntry>(entry: T): string {
		const id: string = uuid()
		this.state.entries.set(id, entry)
		return id
	}

	removeEntry(id: string): void {
		this.state.entries.delete(id)
	}
}