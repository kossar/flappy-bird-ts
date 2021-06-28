import GameScore from './gamescore';
import ScoreBoard from './scoreboard';

export const gameCellPath = 0;
export const gameCellUp = -1;
export const gameCellDown = 1;
const gameCellBird = 2;

export default class GameBrain {
    private rowCount: number;
    private colCount: number;
    private scoreBoard: ScoreBoard;
    private board: Array<number>[] = new Array<Array<number>>();
    //private resizeCache: Array<number>[] = [];
    private birdRow: number;
    private birdCol: number;
    private boardLastQuarter: number;
    private lastObstacle: number;
    private nextObstacle: number;
    private currentScore: GameScore;
    constructor(uiWidth: number, uiHeight: number) {
        this.rowCount = this.setBoardSize(uiHeight);
        this.colCount = this.setBoardSize(uiWidth);

        this.scoreBoard = new ScoreBoard(10); // of GameScore

        this.birdRow = Math.round((this.rowCount / 2) - 1);
        this.birdCol = this.getBirdCol(this.colCount);
        this.boardLastQuarter = Math.floor((this.colCount / 4) * 3);
        this.lastObstacle = 0;
        this.nextObstacle = 0;
        this.initializeBoard();
        this.currentScore = new GameScore();

    }

    setBoardSize(size: number) {
        return Math.round(Math.floor(size) / 18);
    }

    private getBirdCol(countCol: number): number{
        let col: number = Math.floor(countCol / 4);
        if (col < 5) {
            col = 5;
        }
        return col;
    }
    private createGameCol(pathPosition: number, pathHeight: number): number[] {
        let res: number[] = [];
        // console.log(res);
        for (let index = 0; index < this.rowCount; index++) {
            switch (true) {
                case index < pathPosition:
                    res.push(gameCellUp);
                    break;
                case index >= pathPosition + pathHeight:
                    res.push(gameCellDown);
                    break;
                default:
                    res.push(gameCellPath);
                    break;
            }
        }
        return res;

    }

    private createNextFrame(): void {
        this.board.shift();
        this.lastObstacle--; // Decrease last obstacle for add
        this.addColElements(this.colCount - 1);
    }


    private initializeBoard(): void {
        console.log('initializeBoard()');
        let randomDist: number = this.getRandomInt(18, 22);
        this.lastObstacle = this.boardLastQuarter - randomDist;  // Dummy last obstacle for starting calculations        

        for (let index = 0; index < this.colCount; index++) {
            if (index < this.boardLastQuarter) {
                this.board.push(this.createGameCol(0, this.rowCount)); // create empty columns for start
            } else {
                this.addColElements(index);
            }

        }
        this.birdRow = Math.round((this.rowCount / 2) - 1);
        this.board[this.birdCol][this.birdRow] = gameCellBird;
    }

    // Fills game column with elements
    private addColElements(currentIndex: number): void {
        let randomDist: number = this.getRandomInt(18, 22);
        console.log('curindex: ' + currentIndex + ' randdist: ' + randomDist + ' lastobst: ' + this.lastObstacle);
        if (currentIndex - this.lastObstacle >= randomDist) {
            
            console.log('new obstacle');
            let randomPathPos = this.getRandomInt(10, this.rowCount / 2);
            let randomPathHeight = this.getRandomInt(6, this.rowCount - randomPathPos);
            this.board.push(this.createGameCol(randomPathPos, randomPathHeight));

            //this.lastPathHeight = randomPathHeight;
            this.lastObstacle = currentIndex;

        } else {
            this.board.push(this.createGameCol(0, this.rowCount));
        }
        // if (this.resizeCache.length > 0) {
        //     let temp: number[] | undefined = this.resizeCache.shift();
        //     if (temp !== undefined) {
        //         this.board.push(temp);
        //     }    
        // } else {

        // }

    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }


    public resetBoard(): void {
        this.board = [];
        this.initializeBoard();
    }
    public getGameBoard(fromResize: boolean): number[][] {
        if (!fromResize) {
            this.createNextFrame();
            this.moveBird();
            this.addPoints();
        }
        
        return this.board;
    }
    private moveBird(): void {

        console.log("brd col " + this.birdCol + " row " + this.birdRow);
        //Replace old bird location
        this.board[this.birdCol - 1][this.birdRow] = gameCellPath;
        // Subtract to birdrow to simulate bird falling(adding to index)
        this.birdRow++;
        // Add bird to new location
        this.board[this.birdCol][this.birdRow] = gameCellBird;
    }

    public canMove(): boolean {
        if (this.birdRow + 2 >= this.rowCount) {
            this.savePlayerData();
            return false;
        }

        if (this.birdRow < 0) {
            this.birdRow = 0;
            this.savePlayerData();
            return false;
        }
        let colBird: number = this.birdCol - 3;
        console.log('colbird: ' + colBird);
        let rowBird: number = this.birdRow;
        for (let col = colBird; col <= this.birdCol + 1; col++) {
            for (let row = rowBird; row <= this.birdRow + 2; row++) {
                if (this.board[col][row] === gameCellUp || this.board[col][row] === gameCellDown) {
                    this.savePlayerData();
                    return false;
                }

            }

        }
        return true;
    }

    private savePlayerData(): void{
         // If cant move anymore add game score to scoreboard
         this.scoreBoard.addScore(this.currentScore);
         // Save player name for possible use in next game
         let oldName = this.currentScore.name;
         // Create new score instance
         this.currentScore = new GameScore();
         // Set new score instance name with previous name, in case player doesnt want to change it 
         this.currentScore.name = oldName;
    }
    public moveUp(): void {
        let newRow = this.birdRow - 6;
        this.board[this.birdCol][this.birdRow] = gameCellPath;
        this.birdRow = newRow;
        this.board[this.birdCol][this.birdRow] = gameCellBird;
 

    }
    public getColCount(): number{
        return this.colCount;
    }

    public getRowCount(): number{
        return this.rowCount;
    }
    public gameCellPath(): number {
        return gameCellPath;
    }

    public gameCellUp(): number {
        return gameCellUp;
    }

    public gameCellDown() {
        return gameCellDown;
    }

    public gameCellBird(): number {
        return gameCellBird;
    }

    public setPlayerName(name: string): void {
        console.log('setPlayerName: ' + name);
        this.currentScore.name = name;
    }

    public resize(uiWidth: number, uiHeight: number): void{
        let oldRowCount = this.rowCount;
        let oldColCount = this.colCount;
       
        let newColCount = this.setBoardSize(uiWidth);
        let newRowCount = this.setBoardSize(uiHeight);
       
        this.board[this.birdCol][this.birdRow] = gameCellPath;
        this.birdRow = Math.round((newRowCount / 2) - 1);
        this.birdCol = this.getBirdCol(newColCount);
        
        this.rowCount = newRowCount;
        this.colCount = newColCount;
        
        
        if (newRowCount < oldRowCount) {
            console.log('newRowCount < oldRowCount');
            this.board.forEach(row => {
                row = row.slice(0, newRowCount - 1);
            });
        }else if (newRowCount > oldRowCount) {
            console.log('newRowCount > oldRowCount');
            this.board.forEach(row => {
                let el = row[oldRowCount - 1];
                for (let index = oldRowCount - 1; index < newRowCount; index++) {
                    row.push(el);

                }
            });
        }

        if (newColCount < oldColCount) {
            console.log('newColCount < this.colcount');
            console.log('newcolcount: ' + newColCount);
            //let currentArr = this.board.slice(newColCount);
            this.board  = this.sliceArray(this.board, newColCount);
            //console.log(this.board);
          
        } else if (newColCount > oldColCount) {
            console.log('newColCount > this.colCount');
            for (let index = oldColCount - 1; index < newColCount; index++) {
                this.addColElements(index);
                
            }
        }
        this.board[this.birdCol][this.birdRow] = gameCellBird;
        console.log("new board width: " + this.board.length);
    }
    private sliceArray(arr: number[][], limit: number): number[][]{
        let temp: number[][] = [];
        for (let index = 0; index < limit; index++) {
            temp[index] = arr[index];
            
        }
        console.log(temp);
        return temp;
    }
    public getScoreBoard(): GameScore[] {
        return this.scoreBoard.getScores();
    }
    private addPoints(): void {
        console.log('addPoints()');
        console.log(this.birdCol)
        console.log(this.board[this.birdCol - 5][0]);
        if (this.board[this.birdCol - 5][0] === gameCellUp) {
            this.currentScore.score++;
            console.log('score: ' + this.currentScore.score);
        }
    }

    public getCurrentPlayerData(): GameScore {
        console.log('this.getCurrentPlayerData ' + this.currentScore.name)
        return this.currentScore;
    }
}