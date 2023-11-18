import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditActor = (props) => {

    const { actor, editActor } = props;

    const [open, setOpen] = useState(false);
    const [name, setName] = useState(actor.name);
    const [age, setAge] = useState(actor.age);
    const [portrait, setPortrait] = useState(actor.portrait);
    const [about, setAbout] = useState(actor.about);

    
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "name") {
            setName(value);
        } else if (name === "age") {
            setAge(value);
        } else if (name === "portrait") {
            setPortrait(value);
        } else if (name === "about") {
            setAbout(value);
        }
    }

    const handleUpdate = () => {
        editActor(actor.actorId, name, age, portrait, about);
        handleClose();
    };
        

    return (
        <div>
            <Button id="editActor" variant="outlined" color="primary" style={{ margin: 10 }} onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Actor</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }}>
                    <TextField id="name" autoFocus fullWidth label="Actor Name" name="name" onChange={handleChange} />
                    <TextField id="age" autoFocus fullWidth label="Actor Age" name="age" onChange={handleChange} />
                    <TextField id="portrait" autoFocus fullWidth label="Actor Portrait" name="portrait" onChange={handleChange} />
                    <TextField id="about" autoFocus fullWidth label="Actor About" name="about" onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose}>Cancel</Button>
                    <Button id="update" color="primary" onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}

EditActor.propTypes = {
    actor: PropTypes.object.isRequired,
    editActor: PropTypes.func.isRequired
};

export default EditActor;
