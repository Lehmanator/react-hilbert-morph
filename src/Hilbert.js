/**
 * @class       : hilbert
 * @author      : Sam Lehman (samlehman617@gmail.com)
 * @created     : Friday Mar 01, 2019 13:12:40 STD
 * @description : hilbert
 */
import React from 'react';
import * as d3 from 'd3';

class Hilbert extends React.Component {
    // Initialize curve with base case
    constructor(props) {
        super(props);
        this.rules = {L: "+RF-LFL-FR+", R: "-LF+RFR+FL-"};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.state = {
            path: this.makePath(1),
            iteration: 1,
            width: window.innerWidth,
        };
        console.log("Duration:   " + this.props.duration);
        console.log("Iterations: " + this.props.iterations);
        console.log("Rules: " + this.rules["L"]);
        console.log("Rules: " + this.rules["R"]);
    }
    // Create reference
    pathRef = React.createRef();
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.setState({
            path: this.makePath(1),
            iteration: 1,
            width: window.innerWidth,
        });
    }
    // Update path
    componentDidUpdate() {
        var nextIter = this.state.iteration + 1;
        var nextPathStr = this.makePath(nextIter);
        if (nextIter <= this.props.iterations) {
            d3
                .select(this.pathRef.current)
                .transition()
                .duration(this.props.duration)
                .ease(d3.easeCubicInOut)
                .attr("d", nextPathStr)
                .on("end", () =>
                    this.setState({
                        path: nextPathStr,
                        iteration: nextIter,
                        width: window.innerWidth,
                    })
                );
        } else {
            d3
                .select(this.pathRef.current)
                .transition()
                .duration(this.props.duration)
                .ease(d3.easeCubicInOut)
                .attr("d", this.makePath(1))
                .on("end", () =>
                    this.setState({
                        path: this.makePath(1),
                        iteration: 1,
                        width: window.innerWidth,
                    })
                );
        }
    }
    render() {
        const viewBox = "0 0 100% " + this.state.width.toString();
        const scale = "scale("+0.99*this.state.width/512+")";
        return (
            <svg
                className="hilbert"
                position="absolute"
                viewBox={viewBox}
                width={this.state.width}
                height={this.state.width}
                min-height="256px"
                min-width="256px"
                text-align="center"
                fill="none" >
                <path
                    d={this.state.path}
                    ref={this.pathRef}
                    text-align="center"
                    fill="none"
                    stroke="black"
                    stroke-linejoin="round"
                    stroke-width="3"
                    transform={scale}
                    width="100%" />
            </svg>
        );
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth });
    }
    makePath(n) {
        var s = "L";
        for (var i=0; i<n; i++) s = this.next(s);
        for (; i<this.props.iterations; i++) s = this.fake(s);
        return this.curve(s, Math.pow(2, this.props.iterations - n + 3));
    }
    next(s) {
        return s.replace(/([LR])/g, function(x) {
            const RULE = {L: "+RF-LFL-FR+", R: "-LF+RFR+FL-"};
            return RULE[x];
        }).replace(/-\+|\+-|\+\+\+\+|----/g, "");
    }
    fake(s) {
        return s.replace(/([LR])/ig, function(x) {
            const RULE = {L: "+RF-LFL-FR+", R: "-LF+RFR+FL-"};
            return RULE[x.toUpperCase()].toLowerCase();
        }).replace(/-\+|\+-|\+\+\+\+|----/g, "");
    }
    curve(s, scale) {
        var r = "M" + (scale/2) + "," + (scale/2);
        var b = [scale, 0];

        for (var j=0; j<s.length; j++) {
            switch(s.charAt(j)) {
                case '+': b = [ -b[1], b[0] ]; break;
                case '-': b = [ b[1], -b[0] ]; break;
                case 'f': r += "l0,0"; break;
                case 'F': r += "l" + b[0] + "," + b[1]; break;
                default: r = r+""; break;
            }
        }
        console.log(r);
        return r;
    }
}

export default Hilbert;
