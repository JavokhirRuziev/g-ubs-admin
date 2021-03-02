import { schema } from "normalizr";
import isEmpty from "lodash/isEmpty";

export default (entityName, idAttribute = "id", relations) => {
	const entitySchema = new schema.Entity(entityName, undefined, { idAttribute });

	if(!isEmpty(relations)){
		entitySchema.define(relations);
	}

	return entitySchema;
};