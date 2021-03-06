const React = require('react');

class ItemList extends React.Component {

	constructor() {
		super();

		this.scrollTop_ = 0;
	}

	updateStateItemIndexes(props) {
		if (typeof props === 'undefined') props = this.props;

		const topItemIndex = Math.floor(this.scrollTop_ / props.itemHeight);
		const visibleItemCount = Math.ceil(props.style.height / props.itemHeight);

		let bottomItemIndex = topItemIndex + visibleItemCount;
		if (bottomItemIndex >= props.items.length) bottomItemIndex = props.items.length - 1;

		this.setState({
			topItemIndex: topItemIndex,
			bottomItemIndex: bottomItemIndex,
		});
	}

	componentWillMount() {
		this.updateStateItemIndexes();
	}

	componentWillReceiveProps(newProps) {
		this.updateStateItemIndexes(newProps);
	}

	onScroll(scrollTop) {
		this.scrollTop_ = scrollTop;
		this.updateStateItemIndexes();
	}

	render() {
		const items = this.props.items;
		const style = Object.assign({}, this.props.style, {
			overflowX: 'hidden',
			overflowY: 'auto',
		});

		if (!this.props.itemHeight) throw new Error('itemHeight is required');

		const blankItem = function(key, height) {
			return <div key={key} style={{height:height}}></div>
		}

		let itemComps = [blankItem('top', this.state.topItemIndex * this.props.itemHeight)];

		for (let i = this.state.topItemIndex; i <= this.state.bottomItemIndex; i++) {
			const itemComp = this.props.itemRenderer(items[i]);
			itemComps.push(itemComp);
		}

		itemComps.push(blankItem('bottom', (items.length - this.state.bottomItemIndex - 1) * this.props.itemHeight));

		let classes = ['item-list'];
		if (this.props.className) classes.push(this.props.className);

		const that = this;

		return (
			<div className={classes.join(' ')} style={style} onScroll={ (event) => { this.onScroll(event.target.scrollTop) }}>
				{ itemComps }
			</div>
		);
	}
}

module.exports = { ItemList };