import { ConstraintSet } from "../../ConstraintSet";
import { HigherValues } from "../../HigherValues";
import { Tile } from "../../Tile";
import { Constraint } from "../concepts/Constraint";


export class ConstraintHierarchy<T>{
   
    private higherValues: HigherValues
    
    constructor(higherValues : HigherValues){
       
        this.higherValues = higherValues
    }


    checkConstraintsGeneric(currentConstraintsToCheck : ConstraintSet<T>, tileCanvas: Tile<T>[]): Constraint<T>[]{
        
        const sectionTiles = tileCanvas
        let constraints : Constraint<T>[] = []


        currentConstraintsToCheck.getAllHardConstraints().forEach( constraint => {
            let bool = true
            sectionTiles.forEach( sectionTile => {
                if (!constraint.check( sectionTile, this.higherValues)){
                    bool = false
                   
                }
            })
            if (bool){
                constraints.push(constraint)
            }
            
        })
        return constraints

    }

}