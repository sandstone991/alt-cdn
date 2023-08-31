import * as React from 'react';
import '../styles/index.css';
const Options: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <form className="shadow-md m-auto w-3/4 h-3/4">
                <input type="checkbox" name="checkbox" id="checkbox" />
            </form>
        </div>
    );
};

export default Options;
