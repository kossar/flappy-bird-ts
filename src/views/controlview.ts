export default function controlView(eventHandler: { (e: MouseEvent): void; (this: HTMLButtonElement, ev: MouseEvent): any; (this: HTMLButtonElement, ev: MouseEvent): any; }){
    let control: HTMLDivElement = document.createElement('div');
    control.style.height = '50px'; // set height of control view to calculate gameboard height
    control.id = 'control';

    let statisticsButton: HTMLButtonElement = document.createElement('button');
    statisticsButton.id = 'statistics';
    statisticsButton.innerText = 'Statistics';

    let gameButton: HTMLButtonElement = document.createElement('button');
    gameButton.id = 'game';
    gameButton.innerText = 'New Game';

    control.append(statisticsButton);
    control.append(gameButton);

    statisticsButton.addEventListener('click', eventHandler);
    gameButton.addEventListener('click', eventHandler);
    return control;
}