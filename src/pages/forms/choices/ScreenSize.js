import './ScreenSize.css';
import NextButton from '../NextButton';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createToggles, toggleChoice } from '../../../store/slices/forms';
import _ from 'lodash';

// diagonal size in inches 
const A4_SIZE = 14.32059;
// source https://www.euro.com.pl/slownik.bhtml?definitionId=357249498
const SIZES = [
    10, 11, 11.5, 13, 15, 16, 17
]


export class SizeOption {
    constructor(name, size, selectable, vertical=false) {
        this.name = name;
        this.size = size;
        this.selectable = selectable;
        this.vertical = vertical;
    }
}

const OPTIONS = [
    new SizeOption("Kartka A4", A4_SIZE, false, true),
    new SizeOption(">17", 20, true),
    ..._.reverse(SIZES).map(s => new SizeOption(s, s, true)),
    new SizeOption("<10", 8, true),
]

function ChoiceBox({ name, size, checked, onClick, selectable, vertical }) {
    const className = "size-button " + ((checked && selectable) ? 'checked' : '');
    const width = (size * 14 / 1.38 / 15) + "vw";
    const height = (size * 9.5 / 1.38 / 15) + "vw";
    if (!selectable) {
        onClick = ()=>null;
    }
    return <div className={className}
        style={{
            width: vertical ? height : width,
            height: vertical ? width : height,
        }}
        onClick={onClick}>
        <p>
            {name}
        </p>
    </div>;
}

function ScreenSize() {
    const id = "size";
    const value = useSelector(state => state.forms[id]);
    const dispatch = useDispatch();

    // create object in state holding checkbox values
    useEffect(() => {
        if (!value) {
            dispatch(createToggles([id, OPTIONS.map(o => String(o.name))]))
        }
    }, [dispatch, value]);

    function line(sizes) {
        return <div className="size-choices-line">{sizes.map(
            option => <ChoiceBox
                checked={value && value[option.name]}
                onClick={() => dispatch(toggleChoice([id, option.name]))}
                key={option.name} {...option} />)}</div>
    }

    const withIndex = (fn) => {
        let index = 0
        return (thing) => fn(thing, index++)
      }
    
    const divideIntoThreeRows = withIndex((_, index)=>{
            console.log("index", index)
            return Math.floor(Math.min(index/3, 2))
        })

    return (<div className="content">
        <div className='size-choices-container'>
            {_.map(_.groupBy(OPTIONS, divideIntoThreeRows), line)  }
            </div>
        <p className="choice-text">
            * Wartości orientacyjne, wysokości i szerokości laptopów mogą być różne
        </p>
        <NextButton />
    </div>);
}

export default ScreenSize;