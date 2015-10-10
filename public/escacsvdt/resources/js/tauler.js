
//coordenades en pixels
function Point(pX, pY) {
    this.x = pX;
    this.y = pY;
}

//coordenades de posició de l'element dins d'una array
function ElMeuPoint(pI, pJ) {
    this.i = pI;
    this.j = pJ;
}

var NUM_COLUMNES = 8;
var NUM_FILES = 8;
var CASELLA_WIDTH = 60;
var CASELLA_HEIGHT = 60;
var TAULER_REAL = "TAULER_REAL";
var TAULER_VIRTUAL = "TAULER_VIRTUAL";
var ARRAY_TAULER_ACTUAL = "array_tauler_actual";
var ARRAY_TAULER_ANTERIOR = "array_tauler_anterior";
var CASELLA_A1_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 7);
var CASELLA_A2_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 6);
var CASELLA_A3_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 5);
var CASELLA_A4_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 4);
var CASELLA_A5_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 3);
var CASELLA_A6_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 2);
var CASELLA_A7_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 1);
var CASELLA_A8_B = new Point(CASELLA_WIDTH * 0, CASELLA_HEIGHT * 0);
var CASELLA_B1_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 7);
var CASELLA_B2_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 6);
var CASELLA_B3_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 5);
var CASELLA_B4_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 4);
var CASELLA_B5_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 3);
var CASELLA_B6_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 2);
var CASELLA_B7_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 1);
var CASELLA_B8_B = new Point(CASELLA_WIDTH * 1, CASELLA_HEIGHT * 0);
var CASELLA_C1_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 7);
var CASELLA_C2_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 6);
var CASELLA_C3_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 5);
var CASELLA_C4_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 4);
var CASELLA_C5_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 3);
var CASELLA_C6_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 2);
var CASELLA_C7_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 1);
var CASELLA_C8_B = new Point(CASELLA_WIDTH * 2, CASELLA_HEIGHT * 0);
var CASELLA_D1_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 7);
var CASELLA_D2_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 6);
var CASELLA_D3_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 5);
var CASELLA_D4_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 4);
var CASELLA_D5_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 3);
var CASELLA_D6_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 2);
var CASELLA_D7_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 1);
var CASELLA_D8_B = new Point(CASELLA_WIDTH * 3, CASELLA_HEIGHT * 0);
var CASELLA_E1_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 7);
var CASELLA_E2_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 6);
var CASELLA_E3_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 5);
var CASELLA_E4_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 4);
var CASELLA_E5_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 3);
var CASELLA_E6_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 2);
var CASELLA_E7_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 1);
var CASELLA_E8_B = new Point(CASELLA_WIDTH * 4, CASELLA_HEIGHT * 0);
var CASELLA_F1_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 7);
var CASELLA_F2_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 6);
var CASELLA_F3_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 5);
var CASELLA_F4_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 4);
var CASELLA_F5_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 3);
var CASELLA_F6_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 2);
var CASELLA_F7_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 1);
var CASELLA_F8_B = new Point(CASELLA_WIDTH * 5, CASELLA_HEIGHT * 0);
var CASELLA_G1_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 7);
var CASELLA_G2_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 6);
var CASELLA_G3_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 5);
var CASELLA_G4_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 4);
var CASELLA_G5_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 3);
var CASELLA_G6_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 2);
var CASELLA_G7_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 1);
var CASELLA_G8_B = new Point(CASELLA_WIDTH * 6, CASELLA_HEIGHT * 0);
var CASELLA_H1_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 7);
var CASELLA_H2_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 6);
var CASELLA_H3_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 5);
var CASELLA_H4_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 4);
var CASELLA_H5_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 3);
var CASELLA_H6_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 2);
var CASELLA_H7_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 1);
var CASELLA_H8_B = new Point(CASELLA_WIDTH * 7, CASELLA_HEIGHT * 0);
var CASELLA_A1_N = CASELLA_H8_B;
var CASELLA_A2_N = CASELLA_H7_B;
var CASELLA_A3_N = CASELLA_H6_B;
var CASELLA_A4_N = CASELLA_H5_B;
var CASELLA_A5_N = CASELLA_H4_B;
var CASELLA_A6_N = CASELLA_H3_B;
var CASELLA_A7_N = CASELLA_H2_B;
var CASELLA_A8_N = CASELLA_H1_B;
var CASELLA_B1_N = CASELLA_G8_B;
var CASELLA_B2_N = CASELLA_G7_B;
var CASELLA_B3_N = CASELLA_G6_B;
var CASELLA_B4_N = CASELLA_G5_B;
var CASELLA_B5_N = CASELLA_G4_B;
var CASELLA_B6_N = CASELLA_G3_B;
var CASELLA_B7_N = CASELLA_G2_B;
var CASELLA_B8_N = CASELLA_G1_B;
var CASELLA_C1_N = CASELLA_F8_B;
var CASELLA_C2_N = CASELLA_F7_B;
var CASELLA_C3_N = CASELLA_F6_B;
var CASELLA_C4_N = CASELLA_F5_B;
var CASELLA_C5_N = CASELLA_F4_B;
var CASELLA_C6_N = CASELLA_F3_B;
var CASELLA_C7_N = CASELLA_F2_B;
var CASELLA_C8_N = CASELLA_F1_B;
var CASELLA_D1_N = CASELLA_E8_B;
var CASELLA_D2_N = CASELLA_E7_B;
var CASELLA_D3_N = CASELLA_E6_B;
var CASELLA_D4_N = CASELLA_E5_B;
var CASELLA_D5_N = CASELLA_E4_B;
var CASELLA_D6_N = CASELLA_E3_B;
var CASELLA_D7_N = CASELLA_E2_B;
var CASELLA_D8_N = CASELLA_E1_B;
var CASELLA_E1_N = CASELLA_D8_B;
var CASELLA_E2_N = CASELLA_D7_B;
var CASELLA_E3_N = CASELLA_D6_B;
var CASELLA_E4_N = CASELLA_D5_B;
var CASELLA_E5_N = CASELLA_D4_B;
var CASELLA_E6_N = CASELLA_D3_B;
var CASELLA_E7_N = CASELLA_D2_B;
var CASELLA_E8_N = CASELLA_D1_B;
var CASELLA_F1_N = CASELLA_C8_B;
var CASELLA_F2_N = CASELLA_C7_B;
var CASELLA_F3_N = CASELLA_C6_B;
var CASELLA_F4_N = CASELLA_C5_B;
var CASELLA_F5_N = CASELLA_C4_B;
var CASELLA_F6_N = CASELLA_C3_B;
var CASELLA_F7_N = CASELLA_C2_B;
var CASELLA_F8_N = CASELLA_C1_B;
var CASELLA_G1_N = CASELLA_B8_B;
var CASELLA_G2_N = CASELLA_B7_B;
var CASELLA_G3_N = CASELLA_B6_B;
var CASELLA_G4_N = CASELLA_B5_B;
var CASELLA_G5_N = CASELLA_B4_B;
var CASELLA_G6_N = CASELLA_B3_B;
var CASELLA_G7_N = CASELLA_B2_B;
var CASELLA_G8_N = CASELLA_B1_B;
var CASELLA_H1_N = CASELLA_A8_B;
var CASELLA_H2_N = CASELLA_A7_B;
var CASELLA_H3_N = CASELLA_A6_B;
var CASELLA_H4_N = CASELLA_A5_B;
var CASELLA_H5_N = CASELLA_A4_B;
var CASELLA_H6_N = CASELLA_A3_B;
var CASELLA_H7_N = CASELLA_A2_B;
var CASELLA_H8_N = CASELLA_A1_B;
function obtenirPointCasella(color, casella) {
    switch (color) {
        case COLOR_BLANC:
        {
            return casella;
        }
        case COLOR_NEGRE:
            if (compareObjects(casella, CASELLA_A1_B) === true) {
                return CASELLA_A1_N;
            } else if (compareObjects(casella, CASELLA_A2_B) === true) {
                return CASELLA_A2_N;
            } else if (compareObjects(casella, CASELLA_A3_B) === true) {
                return CASELLA_A3_N;
            } else if (compareObjects(casella, CASELLA_A4_B) === true) {
                return CASELLA_A4_N;
            } else if (compareObjects(casella, CASELLA_A5_B) === true) {
                return CASELLA_A5_N;
            } else if (compareObjects(casella, CASELLA_A6_B) === true) {
                return CASELLA_A6_N;
            } else if (compareObjects(casella, CASELLA_A7_B) === true) {
                return CASELLA_A7_N;
            } else if (compareObjects(casella, CASELLA_A8_B) === true) {
                return CASELLA_A8_N;
            } else if (compareObjects(casella, CASELLA_B1_B) === true) {
                return CASELLA_B1_N;
            } else if (compareObjects(casella, CASELLA_B2_B) === true) {
                return CASELLA_B2_N;
            } else if (compareObjects(casella, CASELLA_B3_B) === true) {
                return CASELLA_B3_N;
            } else if (compareObjects(casella, CASELLA_B4_B) === true) {
                return CASELLA_B4_N;
            } else if (compareObjects(casella, CASELLA_B5_B) === true) {
                return CASELLA_B5_N;
            } else if (compareObjects(casella, CASELLA_B6_B) === true) {
                return CASELLA_B6_N;
            } else if (compareObjects(casella, CASELLA_B7_B) === true) {
                return CASELLA_B7_N;
            } else if (compareObjects(casella, CASELLA_B8_B) === true) {
                return CASELLA_B8_N;
            } else if (compareObjects(casella, CASELLA_C1_B) === true) {
                return CASELLA_C1_N;
            } else if (compareObjects(casella, CASELLA_C2_B) === true) {
                return CASELLA_C2_N;
            } else if (compareObjects(casella, CASELLA_C3_B) === true) {
                return CASELLA_C3_N;
            } else if (compareObjects(casella, CASELLA_C4_B) === true) {
                return CASELLA_C4_N;
            } else if (compareObjects(casella, CASELLA_C5_B) === true) {
                return CASELLA_C5_N;
            } else if (compareObjects(casella, CASELLA_C6_B) === true) {
                return CASELLA_C6_N;
            } else if (compareObjects(casella, CASELLA_C7_B) === true) {
                return CASELLA_C7_N;
            } else if (compareObjects(casella, CASELLA_C8_B) === true) {
                return CASELLA_C8_N;
            } else if (compareObjects(casella, CASELLA_D1_B) === true) {
                return CASELLA_D1_N;
            } else if (compareObjects(casella, CASELLA_D2_B) === true) {
                return CASELLA_D2_N;
            } else if (compareObjects(casella, CASELLA_D3_B) === true) {
                return CASELLA_D3_N;
            } else if (compareObjects(casella, CASELLA_D4_B) === true) {
                return CASELLA_D4_N;
            } else if (compareObjects(casella, CASELLA_D5_B) === true) {
                return CASELLA_D5_N;
            } else if (compareObjects(casella, CASELLA_D6_B) === true) {
                return CASELLA_D6_N;
            } else if (compareObjects(casella, CASELLA_D7_B) === true) {
                return CASELLA_D7_N;
            } else if (compareObjects(casella, CASELLA_D8_B) === true) {
                return CASELLA_D8_N;
            } else if (compareObjects(casella, CASELLA_E1_B) === true) {
                return CASELLA_E1_N;
            } else if (compareObjects(casella, CASELLA_E2_B) === true) {
                return CASELLA_E2_N;
            } else if (compareObjects(casella, CASELLA_E3_B) === true) {
                return CASELLA_E3_N;
            } else if (compareObjects(casella, CASELLA_E4_B) === true) {
                return CASELLA_E4_N;
            } else if (compareObjects(casella, CASELLA_E5_B) === true) {
                return CASELLA_E5_N;
            } else if (compareObjects(casella, CASELLA_E6_B) === true) {
                return CASELLA_E6_N;
            } else if (compareObjects(casella, CASELLA_E7_B) === true) {
                return CASELLA_E7_N;
            } else if (compareObjects(casella, CASELLA_E8_B) === true) {
                return CASELLA_E8_N;
            } else if (compareObjects(casella, CASELLA_F1_B) === true) {
                return CASELLA_F1_N;
            } else if (compareObjects(casella, CASELLA_F2_B) === true) {
                return CASELLA_F2_N;
            } else if (compareObjects(casella, CASELLA_F3_B) === true) {
                return CASELLA_F3_N;
            } else if (compareObjects(casella, CASELLA_F4_B) === true) {
                return CASELLA_F4_N;
            } else if (compareObjects(casella, CASELLA_F5_B) === true) {
                return CASELLA_F5_N;
            } else if (compareObjects(casella, CASELLA_F6_B) === true) {
                return CASELLA_F6_N;
            } else if (compareObjects(casella, CASELLA_F7_B) === true) {
                return CASELLA_F7_N;
            } else if (compareObjects(casella, CASELLA_F8_B) === true) {
                return CASELLA_F8_N;
            } else if (compareObjects(casella, CASELLA_G1_B) === true) {
                return CASELLA_G1_N;
            } else if (compareObjects(casella, CASELLA_G2_B) === true) {
                return CASELLA_G2_N;
            } else if (compareObjects(casella, CASELLA_G3_B) === true) {
                return CASELLA_G3_N;
            } else if (compareObjects(casella, CASELLA_G4_B) === true) {
                return CASELLA_G4_N;
            } else if (compareObjects(casella, CASELLA_G5_B) === true) {
                return CASELLA_G5_N;
            } else if (compareObjects(casella, CASELLA_G6_B) === true) {
                return CASELLA_G6_N;
            } else if (compareObjects(casella, CASELLA_G7_B) === true) {
                return CASELLA_G7_N;
            } else if (compareObjects(casella, CASELLA_G8_B) === true) {
                return CASELLA_G8_N;
            } else if (compareObjects(casella, CASELLA_H1_B) === true) {
                return CASELLA_H1_N;
            } else if (compareObjects(casella, CASELLA_H2_B) === true) {
                return CASELLA_H2_N;
            } else if (compareObjects(casella, CASELLA_H3_B) === true) {
                return CASELLA_H3_N;
            } else if (compareObjects(casella, CASELLA_H4_B) === true) {
                return CASELLA_H4_N;
            } else if (compareObjects(casella, CASELLA_H5_B) === true) {
                return CASELLA_H5_N;
            } else if (compareObjects(casella, CASELLA_H6_B) === true) {
                return CASELLA_H6_N;
            } else if (compareObjects(casella, CASELLA_H7_B) === true) {
                return CASELLA_H7_N;
            } else if (compareObjects(casella, CASELLA_H8_B) === true) {
                return CASELLA_H8_N;
            } else {
                return null;
            }
    }
    return null;
}


function obtenirPointCasellaDeIiJ(i, j, colorUsuari) {
    if (i === 0) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A8_B;
                case COLOR_NEGRE:
                    return CASELLA_A8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A7_B;
                case COLOR_NEGRE:
                    return CASELLA_A7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A6_B;
                case COLOR_NEGRE:
                    return CASELLA_A6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A5_B;
                case COLOR_NEGRE:
                    return CASELLA_A5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A4_B;
                case COLOR_NEGRE:
                    return CASELLA_A4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A3_B;
                case COLOR_NEGRE:
                    return CASELLA_A3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A2_B;
                case COLOR_NEGRE:
                    return CASELLA_A2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_A1_B;
                case COLOR_NEGRE:
                    return CASELLA_A1_N;
            }
        }
    } else if (i === 1) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B8_B;
                case COLOR_NEGRE:
                    return CASELLA_B8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B7_B;
                case COLOR_NEGRE:
                    return CASELLA_B7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B6_B;
                case COLOR_NEGRE:
                    return CASELLA_B6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B5_B;
                case COLOR_NEGRE:
                    return CASELLA_B5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B4_B;
                case COLOR_NEGRE:
                    return CASELLA_B4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B3_B;
                case COLOR_NEGRE:
                    return CASELLA_B3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B2_B;
                case COLOR_NEGRE:
                    return CASELLA_B2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_B1_B;
                case COLOR_NEGRE:
                    return CASELLA_B1_N;
            }
        }
    } else if (i === 2) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C8_B;
                case COLOR_NEGRE:
                    return CASELLA_C8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C7_B;
                case COLOR_NEGRE:
                    return CASELLA_C7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C6_B;
                case COLOR_NEGRE:
                    return CASELLA_C6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C5_B;
                case COLOR_NEGRE:
                    return CASELLA_C5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C4_B;
                case COLOR_NEGRE:
                    return CASELLA_C4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C3_B;
                case COLOR_NEGRE:
                    return CASELLA_C3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C2_B;
                case COLOR_NEGRE:
                    return CASELLA_C2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_C1_B;
                case COLOR_NEGRE:
                    return CASELLA_C1_N;
            }
        }
    } else if (i === 3) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D8_B;
                case COLOR_NEGRE:
                    return CASELLA_D8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D7_B;
                case COLOR_NEGRE:
                    return CASELLA_D7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D6_B;
                case COLOR_NEGRE:
                    return CASELLA_D6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D5_B;
                case COLOR_NEGRE:
                    return CASELLA_D5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D4_B;
                case COLOR_NEGRE:
                    return CASELLA_D4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D3_B;
                case COLOR_NEGRE:
                    return CASELLA_D3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D2_B;
                case COLOR_NEGRE:
                    return CASELLA_D2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_D1_B;
                case COLOR_NEGRE:
                    return CASELLA_D1_N;
            }
        }
    } else if (i === 4) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E8_B;
                case COLOR_NEGRE:
                    return CASELLA_E8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E7_B;
                case COLOR_NEGRE:
                    return CASELLA_E7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E6_B;
                case COLOR_NEGRE:
                    return CASELLA_E6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E5_B;
                case COLOR_NEGRE:
                    return CASELLA_E5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E4_B;
                case COLOR_NEGRE:
                    return CASELLA_E4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E3_B;
                case COLOR_NEGRE:
                    return CASELLA_E3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E2_B;
                case COLOR_NEGRE:
                    return CASELLA_E2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_E1_B;
                case COLOR_NEGRE:
                    return CASELLA_E1_N;
            }
        }
    } else if (i === 5) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F8_B;
                case COLOR_NEGRE:
                    return CASELLA_F8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F7_B;
                case COLOR_NEGRE:
                    return CASELLA_F7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F6_B;
                case COLOR_NEGRE:
                    return CASELLA_F6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F5_B;
                case COLOR_NEGRE:
                    return CASELLA_F5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F4_B;
                case COLOR_NEGRE:
                    return CASELLA_F4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F3_B;
                case COLOR_NEGRE:
                    return CASELLA_F3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F2_B;
                case COLOR_NEGRE:
                    return CASELLA_F2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_F1_B;
                case COLOR_NEGRE:
                    return CASELLA_F1_N;
            }
        }
    } else if (i === 6) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G8_B;
                case COLOR_NEGRE:
                    return CASELLA_G8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G7_B;
                case COLOR_NEGRE:
                    return CASELLA_G7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G6_B;
                case COLOR_NEGRE:
                    return CASELLA_G6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G5_B;
                case COLOR_NEGRE:
                    return CASELLA_G5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G4_B;
                case COLOR_NEGRE:
                    return CASELLA_G4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G3_B;
                case COLOR_NEGRE:
                    return CASELLA_G3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G2_B;
                case COLOR_NEGRE:
                    return CASELLA_G2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_G1_B;
                case COLOR_NEGRE:
                    return CASELLA_G1_N;
            }
        }
    } else if (i === 7) {
        if (j === 0) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H8_B;
                case COLOR_NEGRE:
                    return CASELLA_H8_N;
            }
        } else if (j === 1) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H7_B;
                case COLOR_NEGRE:
                    return CASELLA_H7_N;
            }
        } else if (j === 2) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H6_B;
                case COLOR_NEGRE:
                    return CASELLA_H6_N;
            }
        } else if (j === 3) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H5_B;
                case COLOR_NEGRE:
                    return CASELLA_H5_N;
            }
        } else if (j === 4) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H4_B;
                case COLOR_NEGRE:
                    return CASELLA_H4_N;
            }
        } else if (j === 5) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H3_B;
                case COLOR_NEGRE:
                    return CASELLA_H3_N;
            }
        } else if (j === 6) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H2_B;
                case COLOR_NEGRE:
                    return CASELLA_H2_N;
            }
        } else if (j === 7) {
            switch (colorUsuari) {
                case COLOR_BLANC:
                    return CASELLA_H1_B;
                case COLOR_NEGRE:
                    return CASELLA_H1_N;
            }
        }
    }
    return null;
}


function obtenirIiJDePointCasella(colorUsuari, casella) {

    casella = obtenirPointCasella(colorUsuari, casella);
    //console.log("casella:", casella);

    switch (colorUsuari) {
        case COLOR_BLANC:
        {
            if (compareObjects(casella, CASELLA_A1_B) === true) {
                return new ElMeuPoint(0, 7);
            } else if (compareObjects(casella, CASELLA_A2_B) === true) {
                return new ElMeuPoint(0, 6);
            } else if (compareObjects(casella, CASELLA_A3_B) === true) {
                return new ElMeuPoint(0, 5);
            } else if (compareObjects(casella, CASELLA_A4_B) === true) {
                return new ElMeuPoint(0, 4);
            } else if (compareObjects(casella, CASELLA_A5_B) === true) {
                return new ElMeuPoint(0, 3);
            } else if (compareObjects(casella, CASELLA_A6_B) === true) {
                return new ElMeuPoint(0, 2);
            } else if (compareObjects(casella, CASELLA_A7_B) === true) {
                return new ElMeuPoint(0, 1);
            } else if (compareObjects(casella, CASELLA_A8_B) === true) {
                return new ElMeuPoint(0, 0);
            } else if (compareObjects(casella, CASELLA_B1_B) === true) {
                return new ElMeuPoint(1, 7);
            } else if (compareObjects(casella, CASELLA_B2_B) === true) {
                return new ElMeuPoint(1, 6);
            } else if (compareObjects(casella, CASELLA_B3_B) === true) {
                return new ElMeuPoint(1, 5);
            } else if (compareObjects(casella, CASELLA_B4_B) === true) {
                return new ElMeuPoint(1, 4);
            } else if (compareObjects(casella, CASELLA_B5_B) === true) {
                return new ElMeuPoint(1, 3);
            } else if (compareObjects(casella, CASELLA_B6_B) === true) {
                return new ElMeuPoint(1, 2);
            } else if (compareObjects(casella, CASELLA_B7_B) === true) {
                return new ElMeuPoint(1, 1);
            } else if (compareObjects(casella, CASELLA_B8_B) === true) {
                return new ElMeuPoint(1, 0);
            } else if (compareObjects(casella, CASELLA_C1_B) === true) {
                return new ElMeuPoint(2, 7);
            } else if (compareObjects(casella, CASELLA_C2_B) === true) {
                return new ElMeuPoint(2, 6);
            } else if (compareObjects(casella, CASELLA_C3_B) === true) {
                return new ElMeuPoint(2, 5);
            } else if (compareObjects(casella, CASELLA_C4_B) === true) {
                return new ElMeuPoint(2, 4);
            } else if (compareObjects(casella, CASELLA_C5_B) === true) {
                return new ElMeuPoint(2, 3);
            } else if (compareObjects(casella, CASELLA_C6_B) === true) {
                return new ElMeuPoint(2, 2);
            } else if (compareObjects(casella, CASELLA_C7_B) === true) {
                return new ElMeuPoint(2, 1);
            } else if (compareObjects(casella, CASELLA_C8_B) === true) {
                return new ElMeuPoint(2, 0);
            } else if (compareObjects(casella, CASELLA_D1_B) === true) {
                return new ElMeuPoint(3, 7);
            } else if (compareObjects(casella, CASELLA_D2_B) === true) {
                return new ElMeuPoint(3, 6);
            } else if (compareObjects(casella, CASELLA_D3_B) === true) {
                return new ElMeuPoint(3, 5);
            } else if (compareObjects(casella, CASELLA_D4_B) === true) {
                return new ElMeuPoint(3, 4);
            } else if (compareObjects(casella, CASELLA_D5_B) === true) {
                return new ElMeuPoint(3, 3);
            } else if (compareObjects(casella, CASELLA_D6_B) === true) {
                return new ElMeuPoint(3, 2);
            } else if (compareObjects(casella, CASELLA_D7_B) === true) {
                return new ElMeuPoint(3, 1);
            } else if (compareObjects(casella, CASELLA_D8_B) === true) {
                return new ElMeuPoint(3, 0);
            } else if (compareObjects(casella, CASELLA_E1_B) === true) {
                return new ElMeuPoint(4, 7);
            } else if (compareObjects(casella, CASELLA_E2_B) === true) {
                return new ElMeuPoint(4, 6);
            } else if (compareObjects(casella, CASELLA_E3_B) === true) {
                return new ElMeuPoint(4, 5);
            } else if (compareObjects(casella, CASELLA_E4_B) === true) {
                return new ElMeuPoint(4, 4);
            } else if (compareObjects(casella, CASELLA_E5_B) === true) {
                return new ElMeuPoint(4, 3);
            } else if (compareObjects(casella, CASELLA_E6_B) === true) {
                return new ElMeuPoint(4, 2);
            } else if (compareObjects(casella, CASELLA_E7_B) === true) {
                return new ElMeuPoint(4, 1);
            } else if (compareObjects(casella, CASELLA_E8_B) === true) {
                return new ElMeuPoint(4, 0);
            } else if (compareObjects(casella, CASELLA_F1_B) === true) {
                return new ElMeuPoint(5, 7);
            } else if (compareObjects(casella, CASELLA_F2_B) === true) {
                return new ElMeuPoint(5, 6);
            } else if (compareObjects(casella, CASELLA_F3_B) === true) {
                return new ElMeuPoint(5, 5);
            } else if (compareObjects(casella, CASELLA_F4_B) === true) {
                return new ElMeuPoint(5, 4);
            } else if (compareObjects(casella, CASELLA_F5_B) === true) {
                return new ElMeuPoint(5, 3);
            } else if (compareObjects(casella, CASELLA_F6_B) === true) {
                return new ElMeuPoint(5, 2);
            } else if (compareObjects(casella, CASELLA_F7_B) === true) {
                return new ElMeuPoint(5, 1);
            } else if (compareObjects(casella, CASELLA_F8_B) === true) {
                return new ElMeuPoint(5, 0);
            } else if (compareObjects(casella, CASELLA_G1_B) === true) {
                return new ElMeuPoint(6, 7);
            } else if (compareObjects(casella, CASELLA_G2_B) === true) {
                return new ElMeuPoint(6, 6);
            } else if (compareObjects(casella, CASELLA_G3_B) === true) {
                return new ElMeuPoint(6, 5);
            } else if (compareObjects(casella, CASELLA_G4_B) === true) {
                return new ElMeuPoint(6, 4);
            } else if (compareObjects(casella, CASELLA_G5_B) === true) {
                return new ElMeuPoint(6, 3);
            } else if (compareObjects(casella, CASELLA_G6_B) === true) {
                return new ElMeuPoint(6, 2);
            } else if (compareObjects(casella, CASELLA_G7_B) === true) {
                return new ElMeuPoint(6, 1);
            } else if (compareObjects(casella, CASELLA_G8_B) === true) {
                return new ElMeuPoint(6, 0);
            } else if (compareObjects(casella, CASELLA_H1_B) === true) {
                return new ElMeuPoint(7, 7);
            } else if (compareObjects(casella, CASELLA_H2_B) === true) {
                return new ElMeuPoint(7, 6);
            } else if (compareObjects(casella, CASELLA_H3_B) === true) {
                return new ElMeuPoint(7, 5);
            } else if (compareObjects(casella, CASELLA_H4_B) === true) {
                return new ElMeuPoint(7, 4);
            } else if (compareObjects(casella, CASELLA_H5_B) === true) {
                return new ElMeuPoint(7, 3);
            } else if (compareObjects(casella, CASELLA_H6_B) === true) {
                return new ElMeuPoint(7, 2);
            } else if (compareObjects(casella, CASELLA_H7_B) === true) {
                return new ElMeuPoint(7, 1);
            } else if (compareObjects(casella, CASELLA_H8_B) === true) {
                return new ElMeuPoint(7, 0);
            }
        }
        case COLOR_NEGRE:
        {
            if (compareObjects(casella, CASELLA_A1_N) === true) {
                return new ElMeuPoint(7, 0);
            } else if (compareObjects(casella, CASELLA_A2_N) === true) {
                return new ElMeuPoint(7, 1);
            } else if (compareObjects(casella, CASELLA_A3_N) === true) {
                return new ElMeuPoint(7, 2);
            } else if (compareObjects(casella, CASELLA_A4_N) === true) {
                return new ElMeuPoint(7, 3);
            } else if (compareObjects(casella, CASELLA_A5_N) === true) {
                return new ElMeuPoint(7, 4);
            } else if (compareObjects(casella, CASELLA_A6_N) === true) {
                return new ElMeuPoint(7, 5);
            } else if (compareObjects(casella, CASELLA_A7_N) === true) {
                return new ElMeuPoint(7, 6);
            } else if (compareObjects(casella, CASELLA_A8_N) === true) {
                return new ElMeuPoint(7, 7);
            } else if (compareObjects(casella, CASELLA_B1_N) === true) {
                return new ElMeuPoint(6, 0);
            } else if (compareObjects(casella, CASELLA_B2_N) === true) {
                return new ElMeuPoint(6, 1);
            } else if (compareObjects(casella, CASELLA_B3_N) === true) {
                return new ElMeuPoint(6, 2);
            } else if (compareObjects(casella, CASELLA_B4_N) === true) {
                return new ElMeuPoint(6, 3);
            } else if (compareObjects(casella, CASELLA_B5_N) === true) {
                return new ElMeuPoint(6, 4);
            } else if (compareObjects(casella, CASELLA_B6_N) === true) {
                return new ElMeuPoint(6, 5);
            } else if (compareObjects(casella, CASELLA_B7_N) === true) {
                return new ElMeuPoint(6, 6);
            } else if (compareObjects(casella, CASELLA_B8_N) === true) {
                return new ElMeuPoint(6, 7);
            } else if (compareObjects(casella, CASELLA_C1_N) === true) {
                return new ElMeuPoint(5, 0);
            } else if (compareObjects(casella, CASELLA_C2_N) === true) {
                return new ElMeuPoint(5, 1);
            } else if (compareObjects(casella, CASELLA_C3_N) === true) {
                return new ElMeuPoint(5, 2);
            } else if (compareObjects(casella, CASELLA_C4_N) === true) {
                return new ElMeuPoint(5, 3);
            } else if (compareObjects(casella, CASELLA_C5_N) === true) {
                return new ElMeuPoint(5, 4);
            } else if (compareObjects(casella, CASELLA_C6_N) === true) {
                return new ElMeuPoint(5, 5);
            } else if (compareObjects(casella, CASELLA_C7_N) === true) {
                return new ElMeuPoint(5, 6);
            } else if (compareObjects(casella, CASELLA_C8_N) === true) {
                return new ElMeuPoint(5, 7);
            } else if (compareObjects(casella, CASELLA_D1_N) === true) {
                return new ElMeuPoint(4, 0);
            } else if (compareObjects(casella, CASELLA_D2_N) === true) {
                return new ElMeuPoint(4, 1);
            } else if (compareObjects(casella, CASELLA_D3_N) === true) {
                return new ElMeuPoint(4, 2);
            } else if (compareObjects(casella, CASELLA_D4_N) === true) {
                return new ElMeuPoint(4, 3);
            } else if (compareObjects(casella, CASELLA_D5_N) === true) {
                return new ElMeuPoint(4, 4);
            } else if (compareObjects(casella, CASELLA_D6_N) === true) {
                return new ElMeuPoint(4, 5);
            } else if (compareObjects(casella, CASELLA_D7_N) === true) {
                return new ElMeuPoint(4, 6);
            } else if (compareObjects(casella, CASELLA_D8_N) === true) {
                return new ElMeuPoint(4, 7);
            } else if (compareObjects(casella, CASELLA_E1_N) === true) {
                return new ElMeuPoint(3, 0);
            } else if (compareObjects(casella, CASELLA_E2_N) === true) {
                return new ElMeuPoint(3, 1);
            } else if (compareObjects(casella, CASELLA_E3_N) === true) {
                return new ElMeuPoint(3, 2);
            } else if (compareObjects(casella, CASELLA_E4_N) === true) {
                return new ElMeuPoint(3, 3);
            } else if (compareObjects(casella, CASELLA_E5_N) === true) {
                return new ElMeuPoint(3, 4);
            } else if (compareObjects(casella, CASELLA_E6_N) === true) {
                return new ElMeuPoint(3, 5);
            } else if (compareObjects(casella, CASELLA_E7_N) === true) {
                return new ElMeuPoint(3, 6);
            } else if (compareObjects(casella, CASELLA_E8_N) === true) {
                return new ElMeuPoint(3, 7);
            } else if (compareObjects(casella, CASELLA_F1_N) === true) {
                return new ElMeuPoint(2, 0);
            } else if (compareObjects(casella, CASELLA_F2_N) === true) {
                return new ElMeuPoint(2, 1);
            } else if (compareObjects(casella, CASELLA_F3_N) === true) {
                return new ElMeuPoint(2, 2);
            } else if (compareObjects(casella, CASELLA_F4_N) === true) {
                return new ElMeuPoint(2, 3);
            } else if (compareObjects(casella, CASELLA_F5_N) === true) {
                return new ElMeuPoint(2, 4);
            } else if (compareObjects(casella, CASELLA_F6_N) === true) {
                return new ElMeuPoint(2, 5);
            } else if (compareObjects(casella, CASELLA_F7_N) === true) {
                return new ElMeuPoint(2, 6);
            } else if (compareObjects(casella, CASELLA_F8_N) === true) {
                return new ElMeuPoint(2, 7);
            } else if (compareObjects(casella, CASELLA_G1_N) === true) {
                return new ElMeuPoint(1, 0);
            } else if (compareObjects(casella, CASELLA_G2_N) === true) {
                return new ElMeuPoint(1, 1);
            } else if (compareObjects(casella, CASELLA_G3_N) === true) {
                return new ElMeuPoint(1, 2);
            } else if (compareObjects(casella, CASELLA_G4_N) === true) {
                return new ElMeuPoint(1, 3);
            } else if (compareObjects(casella, CASELLA_G5_N) === true) {
                return new ElMeuPoint(1, 4);
            } else if (compareObjects(casella, CASELLA_G6_N) === true) {
                return new ElMeuPoint(1, 5);
            } else if (compareObjects(casella, CASELLA_G7_N) === true) {
                return new ElMeuPoint(1, 6);
            } else if (compareObjects(casella, CASELLA_G8_N) === true) {
                return new ElMeuPoint(1, 7);
            } else if (compareObjects(casella, CASELLA_H1_N) === true) {
                return new ElMeuPoint(0, 0);
            } else if (compareObjects(casella, CASELLA_H2_N) === true) {
                return new ElMeuPoint(0, 1);
            } else if (compareObjects(casella, CASELLA_H3_N) === true) {
                return new ElMeuPoint(0, 2);
            } else if (compareObjects(casella, CASELLA_H4_N) === true) {
                return new ElMeuPoint(0, 3);
            } else if (compareObjects(casella, CASELLA_H5_N) === true) {
                return new ElMeuPoint(0, 4);
            } else if (compareObjects(casella, CASELLA_H6_N) === true) {
                return new ElMeuPoint(0, 5);
            } else if (compareObjects(casella, CASELLA_H7_N) === true) {
                return new ElMeuPoint(0, 6);
            } else if (compareObjects(casella, CASELLA_H8_N) === true) {
                return new ElMeuPoint(0, 7);
            }
        }
    }
    return null;
}


