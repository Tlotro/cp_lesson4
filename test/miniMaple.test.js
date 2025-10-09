import {MiniMaple} from "../src/miniMaple";

test('Extras', () => {
    let tstsbj = new MiniMaple();
    tstsbj.setVariable('y')
    expect(tstsbj.variable).toBe('y')
    tstsbj.setVariable('x')
    expect(tstsbj.variable).toBe('x')
    expect(tstsbj.isText('Ababaca')).toBeTruthy();
    expect(tstsbj.isText('A]')).toBeFalsy();
    tstsbj.lex("1+2-3*4^5+log(xg,17)+cos(x)");
    expect(tstsbj.consume()).toBe(1);
    expect(tstsbj.consume('+')).toBe('+');
    /*function consumebad()
    {
        let tstsbj = new MiniMaple();
        tstsbj.lex("1+2-3*4^5+log(xg,17)+cos(x)");
        tstsbj.consume('bad');
    }
    expect(consumebad()).toThrow('Expected bad');*/
});

test('Lexer', () => {
    let tstsbj = new MiniMaple();
    expect(tstsbj.lex("1+2-3*4^5+log(xg,17)+cos(x)")).toStrictEqual([1,'+',2,'-',3,'*',4,'^',5,'+','log','(','xg',',',17,')','+','cos','(','x',')'])
});

test('Parser', ()=>{
let tstsbj = new MiniMaple();
    tstsbj.lex("1+(2-3)*-4^5+log(xg,17)+cos(x)");
    expect(tstsbj.parse()).toStrictEqual(['+',['+',['+',1,['*',['-',2,3],['^',['-',4],5]]],['log','xg',17]],['cos','x']]);
});

test('Dif', ()=>{
    let tstsbj = new MiniMaple();
    tstsbj.lex("1+(2-3)*-4^5+log(xg,17)+cos(x)");
    expect(tstsbj.simplify(tstsbj.differentiate(tstsbj.parse()))).toStrictEqual(['-',['sin','x']]);
    tstsbj = new MiniMaple();
    tstsbj.lex("sin(x)-tan(x*2)+ctg(x)");
    expect(tstsbj.simplify(tstsbj.differentiate(tstsbj.parse()))).toStrictEqual(["+",
        ["-", 
            ["cos","x"], 
            ["/",2, ["^", ["sin", ["*","x",2]],2]]
        ], 
        ["-",
            ["/",
                1,
                ["^",["cos","x"],2]
            ]
        ]
    ]);
    tstsbj = new MiniMaple();
    tstsbj.lex("sin(x)-tan(x)+ctg(x)");
    expect(tstsbj.simplify(tstsbj.differentiate(tstsbj.parse()))).toStrictEqual(["+",
        ["-", 
            ["cos","x"], 
            ["/",1, ["^", ["sin", "x"],2]]
        ], 
        ["-",
            ["/",1,["^",["cos","x"],2]]
        ]
    ]);
});

test('Simplify', ()=>{
    let tstsbj = new MiniMaple();
    expect(tstsbj.simplify(['+',0,'x'])).toStrictEqual('x');
    expect(tstsbj.simplify(['+','y',0])).toStrictEqual('y');
    expect(tstsbj.simplify(['+',2,2])).toStrictEqual(4);

    expect(tstsbj.simplify(['-',2,3])).toStrictEqual(-1);
    expect(tstsbj.simplify(['-',0,2])).toStrictEqual(-2);
    expect(tstsbj.simplify(['-',0,'x'])).toStrictEqual(['-','x']);
    expect(tstsbj.simplify(['-','y',0])).toStrictEqual('y');
    expect(tstsbj.simplify(['-',2,0])).toStrictEqual(2);
    expect(tstsbj.simplify(['-',0,2])).toStrictEqual(-2);
    expect(tstsbj.simplify(['-',2])).toStrictEqual(-2);

    expect(tstsbj.simplify(['*',2,0])).toStrictEqual(0);
    expect(tstsbj.simplify(['*',0,2])).toStrictEqual(0);
    expect(tstsbj.simplify(['*',1,1])).toStrictEqual(1);
    expect(tstsbj.simplify(['*',1,4])).toStrictEqual(4);
    expect(tstsbj.simplify(['*',5,1])).toStrictEqual(5);
    expect(tstsbj.simplify(['*',4,2])).toStrictEqual(8);
    
    expect(tstsbj.simplify(['/',0,3])).toStrictEqual(0);
    expect(tstsbj.simplify(['/',2,1])).toStrictEqual(2);
    
    expect(tstsbj.simplify(['^',18,0])).toStrictEqual(1);
    expect(tstsbj.simplify(['^',2,1])).toStrictEqual(2);
    expect(tstsbj.simplify(['^',2,3])).toStrictEqual(8);

    expect(tstsbj.simplify(['tan',18])).toBeCloseTo(-1.13731371233768);
    expect(tstsbj.simplify(['ctg',18])).toBeCloseTo(-0.87926487577869258689);
    expect(tstsbj.simplify(['ln',2])).toBeCloseTo(0.6931471805599453);
    expect(tstsbj.simplify(['log',4,2])).toStrictEqual(2);
});

test('ToStr', ()=>{
let tstsbj = new MiniMaple();
    tstsbj.lex("1+(2-3)*-4^5+log(xg,17)+cos(x)");
    expect(tstsbj.toString(tstsbj.simplify(tstsbj.differentiate(tstsbj.parse())))).toStrictEqual('(sin(x))');
});

//Had to write everything blind because of Execution policy trying to stick it's finges up my... work...
//Too bad...