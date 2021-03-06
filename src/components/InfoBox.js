import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import "../componentCss/InfoBox.css"

function infoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && 'infoBox--red'}`}>
            <CardContent>
                <Typography variant="h6" className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* 1.2M Total */}
                <Typography variant="h6" className="infoBox__total">
                    Total: {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default infoBox
