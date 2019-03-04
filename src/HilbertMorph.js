/**
 * @component   : Hilbert
 * @author      : Sam Lehman (samlehman617@gmail.com)
 * @created     : Monday Mar 04, 2019 04:27:53 STD
 * @description : Hilbert
 */

import React from 'react'
import * as d3 from 'd3'

class HilbertMorph extends React.Component {
    constructor(props) {
        super(props)
        console.log("Iterations: [" + this.props.begin_iteration + ", " + this.props.end_iteration + "]")
        console.log("     Rules: L:", this.props.rules[0] + "\n            R:", this.props.rules[1])
        // Track window dimensions
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
        // Calculate all necessary strings
        var strings = this.getAllStrings()
        this.state = {
            iteration_strings: strings.iter,
            path_strings: strings.path,
            curr_iteration: this.props.begin_iteration,
            forwards: true,
            width: 0,
        }
        console.log(this.props.begin_iteration)
    }
    // Create reference
    pathRef = React.createRef()
    componentDidMount() {
        console.log("Component mounted...", this.state.path_strings.length - 1, "iterations generated.")
        this.updateWindowDimensions()
        window.addEventListener('resize', this.updateWindowDimensions)
        this.animate(this.props.begin_iteration, true, this.props.duration, d3.easeCubicInOut)
    }
    componentDidUpdate() {
        var next_iter = this.getNextIteration()
        var next_dir  = this.getNextDirection()
        var duration = this.props.duration
        if (!next_dir) { duration = this.props.duration / 2 }
        this.animate(next_iter, next_dir, duration, d3.easeCubicInOut)
    }
    next(s) {
        return s.replace(/([LR])/g, function(x) {
            switch (x) {
                case 'L':  return "+RF-LFL-FR+";
                case 'R':  return "-LF+RFR+FL-";
                default: return "+RF-LFL-FR+";
            }
        }).replace(/-\+|\+-|\+\+\+\+|----/g, "")
    }
    fake(s) {
        return s.replace(/([LR])/ig, function(x) {
            switch (x.toUpperCase()) {
                case 'L':  return "+RF-LFL-FR+".toLowerCase();
                case 'R':  return "-LF+RFR+FL-".toLowerCase();
                default:  return "+RF-LFL-FR+".toLowerCase();
            }
        }).replace(/-\+|\+-|\+\+\+\+|----/g, "")
    }
    // Get the string for the iteration number
    getIterationString(iter) {
        var s = "L"
        for (var i=0; i<iter; i++) s = this.next(s);
        for (; i<this.props.end_iteration; i++) s = this.fake(s);
        return s
    }
    // Turn an instruction string into a path string
    getPathString(s, scale) {
        var r = "M" + (scale/2) + "," + (scale/2)
        var b = [scale, 0];
        for (var j=0; j<s.length; j++) {
            switch(s.charAt(j)) {
                case '+': b = [-b[1], b[0] ]; break;
                case '-': b = [ b[1],-b[0] ]; break;
                case 'f': r += "l0,0"; break;
                case 'F': r += "l" + b[0] + "," + b[1]; break;
                default: r += ""; break;
            }
        }
        return r
    }
    getAllStrings() {
        var iter_strings = ["L"]
        var path_strings = ["M256,M256"]
        for (var i=1; i<=this.props.end_iteration; i++) {
            var scale = this.getScale(i)
            var iter_string = this.getIterationString(i)
            var path_string = this.getPathString(iter_string, scale)
            console.log("["+i+"] Scale:  ", scale, "\n    IterStr:", iter_string.slice(0, 25), "\n    PathStr:", path_string.slice(0, 25));
            iter_strings.push(iter_string)
            path_strings.push(path_string)
        }
        return {iter: iter_strings, path: path_strings}
    }
    getUpdatedPathStrings() {
        var path_strings = []
        for (var i=0; i<this.props.end_iteration; i++) {
            var scale = this.getScale(i)
            path_strings.append(this.getPathString(this.iteration_strings[i], scale))
        }
        return path_strings
    }
    getScale(iter) { return Math.pow(2, this.props.end_iteration - iter + 1); }
    getNextIteration() {
        var c_i = parseInt(this.state.curr_iteration, 10)
        if (this.props.end === "reverse") {
            if (this.state.forwards) {
                if (c_i >= this.props.end_iteration) return c_i - 1;  // Hit upper bound
                else return c_i + 1;                                  // Normal increasing
            } else {
                if (c_i > this.props.begin_iteration) return c_i - 1; // Normal decreasing
                else return c_i + 1;                                  // Hit Lower bound
            }
        } else {
            if (c_i < this.props.end_iteration) return c_i + 1;       // Normal increasing
            else return this.props.begin_iteration;                   // Reset
        }
    }
    getNextDirection() {
        var c_i = this.state.curr_iteration
        if (this.props.end === "reverse") {
            if (this.state.forwards) {
                if (c_i >= this.props.end_iteration) return false;    // Hit upper bound
                else return true;                                     // Normal increasing
            } else {
                if (c_i > this.props.begin_iteration) return false;   // Normal decreasing
                else return true;                                     // Hit Lower bound
            }
        } else return true;                                           // Never reverse
    }
    animate(iter, direction, duration, ease) {
        console.log("["+iter+"] Animating...")
        d3
            .select(this.pathRef.current)
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("d", this.state.path_strings[iter])
            .on("end", () =>
                this.setState({
                    curr_iteration: iter,
                    forwards: direction,
                })
            )

    }
    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
        })
        // var width = window.innerWidth;
        // this.scale = Number(0.99 * this.width / Math.pow(2, this.props.end_iteration + 1))
        // this.setState({ scale: Number(0.99 * width / Math.pow(2, this.props.end_iteration + 1))})
    }
  render() {
    var iters = this.props.end_iteration
    var scale = "scale("+ Number(0.99 * this.state.width / Math.pow(2, parseInt(this.props.end_iteration, 10) + 1)) + ")"
    console.log(this.state.width)
    console.log(iters+1)
    console.log(this.props.end_iteration)
    console.log(Math.pow(2, this.props.end_iteration + 1))
    console.log(scale)
    return (
    <div width="100%">
        <svg
            className="hilbertMorph"
            width="100%"
            height={this.state.width}
        >
            <path
                d={this.state.path_strings[this.state.curr_iteration]}
                ref={this.pathRef}
                fill="none"
                stroke="black"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="4"
                transform={scale}
                width="100%"
            />
        </svg>
    </div>
    )
  }
}
export default HilbertMorph
