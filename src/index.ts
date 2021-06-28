import mainView from './views/mainview';
import controlView from './views/controlview';
import gameView from './views/gameview';


import GameBrain from './model/gamebrain';
import GameController from './controllers/game-controller';
import StatisticsController from './controllers/statistics-controller';

let width: number = window.innerWidth;
let height: number = window.innerHeight - 50; // TODO: should change 50 (control area height), to something dynamic

let brain: GameBrain = new GameBrain(width, height);
let game_view: HTMLDivElement = gameView();

let gameController: GameController = new GameController(brain, game_view);
let statisticsController: StatisticsController = new StatisticsController(brain, game_view);

let view: HTMLDivElement = mainView();
document.body.append(view);

let ctrl_view: HTMLDivElement = controlView(gameControlCLick);

view.append(ctrl_view);
view.append(game_view);


function gameControlCLick(e: MouseEvent) {
    console.log(e);
    const element: HTMLButtonElement = e.currentTarget as HTMLButtonElement;
    if (element !== null) {

        switch (element.id) {
            case 'game':
                console.log('gameControlClick - game');

                statisticsController.stop();
                gameController.run();

                break;
            case 'statistics':

                console.log('gameControlClick - statistics');
                gameController.stop(true);
                statisticsController.run();
                break;

            default:
                break;
        }
    }
}

statisticsController.run();
//gameController.run();


let game: HTMLDivElement | null = document.querySelector('#view-container');
if (game !== null) {
    game.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        const element: HTMLElement = e.target as HTMLElement;
        console.log("classname: " + element.className);
        console.log(element);
        console.log(e);
        if (element.id === 'submit') {
            console.log('submit');
            let nameElem: HTMLInputElement | null = document.querySelector('#name');
            let name: string = 'Player';
    
            if (nameElem && nameElem.value.trim().length > 0) {
                console.log('name: ' + name);
                name = nameElem.value.trim();
    
            }
            console.log('submit');
            brain.setPlayerName(name);
            statisticsController.refreshData();
        } else if (element.className === 'element') {
            console.log('move');
            console.log(game);
            gameController.move();
        }
        e.preventDefault();
    });
}



window.addEventListener('resize', () => {
    gameController.resizeUi(window.innerWidth, window.innerHeight - 50);
    //statisticsController.resizeUi();
});

document.addEventListener('keydown', (e: KeyboardEvent) => {
    console.log(e);
    if (e.code === 'Space') {

        console.log('e.code: ' + e.code);
        gameController.move();
        e.preventDefault();
    }
});


