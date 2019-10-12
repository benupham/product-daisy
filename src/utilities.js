
export function textFormatter(str, width, maxLength = null) {
  if (maxLength !== null) {
    str = str.length > maxLength ? str.substr(0, maxLength) + '...' : str;
  }
  if (str.length > width) {
    var p = width;
    while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
      p--;
    }
    if (p > 0) {
      var left;
      if (str.substring(p, p + 1) == '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      var right = str.substring(p + 1);
      return [left, textFormatter(right, width, maxLength)];
    }
  }
 
  return [str,''];    
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null)
           .append("tspan")
           .attr("x", 0)
           .attr("y", y)
           .attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
           .attr("x", 0)
           .attr("y", y)
           .attr("dy", ++lineNumber * lineHeight + dy + "em")
           .text(word);
      }
    }
  });
}

export function jiggle() {
  // something goes very wrong when I use this...
  return (Math.random() - 0.5) * 1e-6;
}
