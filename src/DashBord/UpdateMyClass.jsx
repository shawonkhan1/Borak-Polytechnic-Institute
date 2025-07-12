import React from 'react';
import { useParams } from 'react-router';

const UpdateMyClass = () => {
     const { id } = useParams();
     console.log(id);
    return (
        <div>
            <h1>this is id {id}</h1>
        </div>
    );
};

export default UpdateMyClass;