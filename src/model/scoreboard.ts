import GameScore from "./gamescore";

export default class ScoreBoard{
    private scoreBoard: GameScore[];
    private maxSize: number;
    constructor(size: number){
        this.scoreBoard = [];
        this.maxSize = size;
    }

    public addScore(gameScore: GameScore){
        console.log('addscore');
        if (this.scoreBoard.length === this.maxSize) {
            this.scoreBoard.pop();
        }

        this.scoreBoard.push(gameScore);
        this.scoreBoard.sort(this.compare);
        this.scoreBoard.reverse();
    }

    public getScores(): GameScore[] {
        console.log('getScores()');
        this.scoreBoard.forEach( b => {
            console.log(b.name + ' ' + b.score);
        }); 
        return this.scoreBoard;
    }
    private compare(a: GameScore, b: GameScore ): -1 | 0 | 1 {
        if ( a.score < b.score ){
          return -1;
        }
        if ( a.score > b.score ){
          return 1;
        }
        return 0;
      }
}