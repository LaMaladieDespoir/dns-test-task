var React = require('react');
var $ = require('jquery-browserify');

var DnsTree = React.createClass({
	getInitialState: function() {
		return {tree:[]};
	},
	componentDidMount: function() {
		this.refreshData();
	},
	refreshData: function(){
		$.getJSON('/ajax.php',{action:'get'},function(data) {
			console.log(data);
			this.setState({
				tree:data,
			});
		}.bind(this));
	},
	handlerFolderClick: function(event) {
		$(event.target).next('ul').toggle();
	},
	loopCategory: function(categories,files){
		return (<ul>{categories.map(function(category,ikey){
						var child;
						if (category.child.length || category.files.length) {
							child = this.loopCategory(category.child,category.files);
						}else{
							child = null;
						}
						return (<li key={ikey}><b onClick={this.handlerFolderClick}>{category.name}</b>{child}</li>);
					}.bind(this))}

					{files.map(function(file,ikey){
						return (<li key={ikey+100}>{file.name}</li>);
					}.bind(this))}
			</ul>);
	},
	render: function() {
		return (<div>{this.loopCategory(this.state.tree,[])}</div>);
	}
});

module.exports = DnsTree;
