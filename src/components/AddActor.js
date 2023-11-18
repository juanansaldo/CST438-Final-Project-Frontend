import React, { useState } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const AddActor = (props) => {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("John Doe");
    const [age, setAge] = useState(1);
    const [portrait, setPortrait] = useState("");
    const [about, setAbout] = useState("");

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        if (event.target.name === "name") {
            setName(event.target.value);
        } else if (event.target.name === "age") {
            setAge(event.target.value);
        } else if (event.target.name === "portrait") {
            setPortrait(event.target.value);
        } else if (event.target.name === "about") {
            setAbout(event.target.value);
        }
    };

    const handleAdd = () => {
        props.addActor(name, age, portrait, about);
        handleClose();
    }

    return (
        <div>
            <Button id="addActor" variant="outlined" color="primary" style={{ margin: 10 }} onClick={handleClickOpen}>
                Add Actor
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Actor</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }}>
                    <TextField id="name" autoFocus fullWidth label="Actor Name" name="name" onChange={handleChange} />
                    <TextField id="age" autoFocus fullWidth label="Actor Age" name="age" onChange={handleChange} />
                    <TextField id="portrait" autoFocus fullWidth label="Actor Portrait" name="portrait" onChange={handleChange} />
                    <TextField id="about" autoFocus fullWidth label="Actor About" name="about" onChange={handleChange} />
                </DialogContent>

                <DialogActions>
                    <Button color="secondary" onClick={handleClose}>Cancel</Button>
                    <Button id="add" color="primary" onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}

AddActor.propTypes = {
    addActor: PropTypes.func.isRequired
}

export default AddActor;