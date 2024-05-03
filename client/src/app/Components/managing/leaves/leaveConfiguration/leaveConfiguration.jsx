import React, {useState} from "react";
import {leaveConfigurationStyles} from "./style";
import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Switch,
    Select, MenuItem
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";


function LeaveConfiguration() {
    const classes = leaveConfigurationStyles();
    const [maternityLeaveDays, setMaternityLeaveDays] = useState('');
    const [sickLeaveDays, setSickLeaveDays] = useState('');
    const [gracePeriod, setGracePeriod] = useState('');
    const [leaveRegime, setLeaveRegime] = useState('18');
    const [checked, setChecked] = useState(true);
    const [holidaySystem, setHolidaySystem] = React.useState('');

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    const [roles, setRoles] = useState({
        admin: false,
        rh: false,
        manager: false
    });
    const [isChecked, setIsChecked] = useState(false);
    const [years, setYears] = useState('');

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleTextFieldChange = (event) => {
        setYears(event.target.value);
    };
    const handleChangeSelect = (event) => {
        setHolidaySystem(event.target.value);
    };
    const handleChangeCheckBox = (event) => {
        setRoles({...roles, [event.target.name]: event.target.checked});
    };
    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <span className={classes.spanT}>Bienvenue au configuration des congés,</span>
            </div>
            <div className={classes.contentSection}>
                <div>
                    <h3 style={{color: "orange"}}>La configuration des congés</h3>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" style={{color: 'green'}}>Regime du congé:</FormLabel>
                        <RadioGroup row aria-label="regimeConge" name="regimeConge" value={leaveRegime}
                                    onChange={(e) => setLeaveRegime(e.target.value)}>
                            <FormControlLabel value="18" control={<Radio/>} label="18 jours"/>
                            <FormControlLabel value="22" control={<Radio/>} label="22 jours"/>
                        </RadioGroup>
                    </FormControl>
                    <hr/>
                    <span style={{color: "orange"}}>Les types de congé:</span>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: '10px'}}>
                            <p>Congé maternité</p>
                            <TextField
                                label="Nombre de jours"
                                value={maternityLeaveDays}
                                onChange={(e) => setMaternityLeaveDays(e.target.value)}
                            />
                        </div>
                        <div>
                            <h5 style={{marginBottom: '1px'}}>Congé maladie </h5>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <p style={{fontSize: "10px", marginRight: '10px'}}>obligation du depot de certificat</p>
                                <FormControlLabel
                                    control={<Switch checked={checked} onChange={handleChange}/>}
                                    label={checked ? 'On' : 'Off'}
                                />
                            </div>
                            <FormControl component="fieldset">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <TextField
                                        style={{marginRight: '16px'}}
                                        label={"Nombre de jours"}
                                        type={"number"}
                                        value={sickLeaveDays}
                                        onChange={(e) => setSickLeaveDays(e.target.value)}
                                    />
                                    <TextField
                                        label="Période de grâce"
                                        type={"number"}
                                        value={gracePeriod}
                                        onChange={(e) => setGracePeriod(e.target.value)}
                                    />
                                </div>
                            </FormControl>
                        </div>

                    </div>
                    <hr/>
                    {/* Role*/}
                    <div>
                        <div style={{marginRight: '10px'}}>
                            <h5>Les demandes de congé sont acceptée par</h5>
                        </div>
                        <div>
                            <FormControl component="fieldset">
                                <FormGroup>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={roles.admin}
                                                    onChange={handleChangeCheckBox}
                                                    name="admin"
                                                />
                                            }
                                            label="Administrateur"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={roles.rh}
                                                    onChange={handleChangeCheckBox}
                                                    name="rh"
                                                />
                                            }
                                            label="Ressource Humaine"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={roles.manager}
                                                    onChange={handleChangeCheckBox}
                                                    name="manager"
                                                />
                                            }
                                            label="Chef de Projet"
                                        />
                                    </div>
                                </FormGroup>
                            </FormControl>
                        </div>

                    </div>
                    <hr/>
                    {/* Preavis du congé*/}
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: '20px',display: 'flex', alignItems: 'center'}}>
                            <div>
                                <TextField
                                    label="Préavis pour congé"
                                    value={maternityLeaveDays}
                                    onChange={(e) => setMaternityLeaveDays(e.target.value)}
                                />
                                <FormHelperText>Le minimum de jour avant la demande de congé.</FormHelperText>
                            </div>
                            <span>Jours</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div>
                                <TextField
                                    label="Durée de congé"
                                    value={maternityLeaveDays}
                                    onChange={(e) => setMaternityLeaveDays(e.target.value)}
                                />
                                <FormHelperText>Le nombre de jour de congé pour un utilisateur</FormHelperText>
                            </div>
                            <span>Jours</span>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <FormControl fullWidth>
                                <InputLabel id="holiday-system-label">Système de jour férié</InputLabel>
                                <Select
                                    labelId="holiday-system-label"
                                    value={holidaySystem}
                                    onChange={handleChangeSelect}
                                    label="Système de jour férié"
                                >
                                    <MenuItem value="FR">FR</MenuItem>
                                    <MenuItem value="ENG">ENG</MenuItem>
                                </Select>
                                <FormHelperText>Le système de jour férié.</FormHelperText>
                            </FormControl>

                        </div>

                    </div>
                    {/* Regle du congé*/}
                    <hr/>
                    <div>
                        <div style={{marginRight: '10px'}}>
                            <h5>Les règles de congé à respecter:</h5>
                        </div>
                        <div>
                            <FormControl component="fieldset">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Afficher les options"
                                />
                                {isChecked && (
                                    <div>
                                        <TextField
                                            label="Minimum d'année"
                                            value={years}
                                            onChange={handleTextFieldChange}
                                        /> <span>Jours</span>
                                        <FormHelperText>Le minimum d'année d'embauche d'un utilisateur</FormHelperText>
                                    </div>
                                )}
                            </FormControl>
                        </div>
                    </div>
                    {/* Configuration du télétravail*/}
                    <hr/>
                </div>
                <div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <h3 style={{color: "orange", marginRight: '20%'}}>La configuration des congés</h3>
                        <FormControlLabel
                            control={<Switch checked={checked} onChange={handleChange}/>}
                            label={checked ? 'On' : 'Off'}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div>
                            <FormControl component="fieldset">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div>
                                        <TextField
                                            style={{marginRight: '16px'}}
                                            label={"Nombre de jours"}
                                            type={"number"}
                                            value={sickLeaveDays}
                                            onChange={(e) => setSickLeaveDays(e.target.value)}
                                        />
                                        <FormHelperText>Combien de jour l'utilisateur peut ...</FormHelperText>
                                    </div>
                                    <span>/Semaine</span>
                                    <div>
                                        <TextField
                                            style={{marginLeft: '20%'}}
                                            label="Nombre d'employeé"
                                            type={"number"}
                                            value={gracePeriod}
                                            onChange={(e) => setGracePeriod(e.target.value)}
                                        />
                                        <FormHelperText>Le minimum d'année d'embauche d'un utilisateur</FormHelperText>
                                    </div>
                                </div>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div style={{marginTop :'3%'}}>
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        Enregistrer
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default LeaveConfiguration;