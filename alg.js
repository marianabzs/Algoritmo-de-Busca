function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
            break;
        }
    }
}

function heuristica(a, b) {
    var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

var col = 25;
var lin = 25;
var grid = new Array(col);

var openSet = [];
var closedSet = [];
var inicio;
var fim;
var w, h;
var caminho = [];
var semsolucao = false;

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.vizinhos = [];
    this.anterior = undefined;
    this.parede = false;

    if (random(1) < 0.3) {
        this.parede = true;
    }

    this.show = function(cor) {
        fill(cor);

        if (this.parede) {
            fill(0);
        }

        noStroke();
        rect(this.i * w, this.j * h, w - 1, h - 1);    
    }

    this.addVizinhos = function(grid) {
        var i = this.i;
        var j = this.j; 
        if (i < col - 1) {
            this.vizinhos.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.vizinhos.push(grid[i - 1][j]);
        }
        if (j < lin - 1) {
            this.vizinhos.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.vizinhos.push(grid[i][j - 1]);
        }
    }
}   

function setup() {
    createCanvas(400, 400);
    console.log("A*");

    w = width / col;
    h = height / lin;

    for (var i = 0; i < col; i++) {
        grid[i] = new Array(lin);
    }

    for (var i = 0; i < col; i++) {
        for (var j = 0; j < lin; j++) {
            grid[i][j] = new Spot(i, j); 
        }
    }

      for (var i = 0; i < col; i++) {
        for (var j = 0; j < lin; j++) {
            grid[i][j].addVizinhos(grid); 
        }
    }

    inicio = grid[0][0];
    fim = grid[col - 1][lin - 1];
    inicio.parede = false;
    fim.parede = false;

    openSet.push(inicio);

    console.log(grid);
}

function draw() {
    if (openSet.length > 0) {

        var menor = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[menor].f) {
                menor = i;
            }
        }

        var current = openSet[menor];

        if (current === fim) {
            // achou a solução
            noLoop();
            console.log("Achou a solução");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var vizinhos = current.vizinhos;
        
        for (var i = 0; i < vizinhos.length; i++) {
            var vizinho = vizinhos[i];

            if(!closedSet.includes(vizinho) && !vizinho.parede) {
                var tempG = current.g + 1;
                var novoCaminho = false;

                if(openSet.includes(vizinho)) {
                    if (tempG < vizinho.g) {
                        vizinho.g = tempG;
                        novoCaminho = true;
                    }
                } else {
                    vizinho.g = tempG;
                    novoCaminho = true;
                    openSet.push(vizinho);
                }
                
                if (novoCaminho) {
                    vizinho.h = heuristica(vizinho, fim);
                    vizinho.f = vizinho.g + vizinho.h;
                    vizinho.anterior = current;
                }
            }
        }

        // continua
    } else {
        // sem solução
        console.log("Sem solução");
        semsolucao = true;
        noLoop();
    }

    background(0);

    for (var i = 0; i < col; i++) {
        for (var j = 0; j < lin; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for(var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    if (!semsolucao) {
        caminho = [];
        var temp = current;
        caminho.push(temp);

        while (temp.anterior) {
            caminho.push(temp.anterior);
            temp = temp.anterior;
        }
    }

    for (var i = 0; i < caminho.length; i++) {
        caminho[i].show(color(0, 0, 255));
    }
}