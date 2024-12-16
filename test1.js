function centroid(c) {
    var centroid = [];
    var i = 0;
    var j = 0;
    var l = c.length;
    for (i = 0; i< l; i++){
        for (j = 0; j< c[i].length; j++){
            if (centroid[j] !== undefined){
                centroid[j] += c[i][j]/l;
            }
            else{
                centroid.push(0);
                centroid[j] += c[i][j]/l;
            }
        }
    }
    return centroid;
  }

var c = [[0,0], [0,20], [20,0], [20,10]]
console.log(centroid(c));