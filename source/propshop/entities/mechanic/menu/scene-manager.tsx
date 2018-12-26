
import {h, Component} from "preact"
import {observer} from "mobx-preact"

import {SceneManagerStore} from "./scene-manager-store"

interface SceneManagerProps {
	store: SceneManagerStore
}

@observer
export class SceneManager extends Component<SceneManagerProps> {

	private resetLoaderInput() {
		const value = ""
		const input = this.base.querySelector<HTMLInputElement>(".loader > input")
		input.value = value
		this.props.store.setLoaderInput(value)
	}

	private handleLoaderInputChange = event => {
		const {value} = event.target
		this.props.store.setLoaderInput(value)
	}

	private handleLoaderButtonClick = () => {
		this.props.store.loadBabylonObjects()
			.then(clear => clear ? this.resetLoaderInput() : null)
	}

	private handleClearAllClick = () => {
		this.props.store.clearAllSceneObjects()
	}

	private handleLoaderInputKeyPress = (event: KeyboardEvent) => {
		if (event.keyCode === 13) {
			this.handleLoaderButtonClick()
		}
		this.handleLoaderInputChange(event)
	}

	render() {
		const {store} = this.props
		return (
			<div class="scene-manager">
				<div className="loader">
					<input
						type="text"
						placeholder=".babylon url"
						onChange={this.handleLoaderInputChange}
						onKeyPress={this.handleLoaderInputKeyPress}
						disabled={store.loading ? true : undefined}
						/>
					<button
						onClick={this.handleLoaderButtonClick}
						disabled={store.loading ? true : undefined}>
						load
					</button>
				</div>
				{
					store.loading
						? store.loaderProgress !== null
							? <progress min={0} max={100} value={store.loaderProgress}/>
							: <progress/>
						: null
				}
				<ul className="error-report-list">
					{[...store.errors].reverse().map(errorReport => (
						<li key={errorReport.id}>
							<strong>{errorReport.label}:</strong>
							&nbsp;<span>{errorReport.message}</span>
						</li>
					))}
				</ul>
				<ul className="scene-object-list">
					{store.sceneObjects.map(sceneObject => {
						const isSelected = (sceneObject === store.selectedObject)
						const handleSelection = () => store.setSelectedObject(sceneObject)
						const handleRemoval = () => store.removeSingleSceneObject(sceneObject)
						return (
							<li data-is-selected={isSelected ? "true" : "false"}>
								<p onClick={handleSelection}>{sceneObject.label}</p>
								<button onClick={handleRemoval}>Remove</button>
							</li>
						)
					})}
				</ul>
				<div className="danger-zone">
					<button
						className="clear-all"
						onClick={this.handleClearAllClick}>
							Clear all
					</button>
				</div>
			</div>
		)
	}
}