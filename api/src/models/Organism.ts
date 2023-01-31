import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../db/config";
import { Ticket } from "./Ticket";
import { OrganismGroup } from "./OrganismGroup";

export class Organism extends Model<
  InferAttributes<Organism>,
  InferCreationAttributes<Organism>
> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  declare id: CreationOptional<number>;
  declare name: string;

  // foreign keys are automatically added by associations methods (like Project.belongsTo)
  // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
  // display an error if ownerId is missing.
  declare organismGroupId: ForeignKey<OrganismGroup["id"]>;

  // `organismGroup` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare organismGroup?: NonAttribute<OrganismGroup>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getOrganismGroup: BelongsToGetAssociationMixin<OrganismGroup>;
  declare setOrganismGroup: BelongsToSetAssociationMixin<
    OrganismGroup,
    OrganismGroup["id"]
  >;
  declare createOrganismGroup: BelongsToCreateAssociationMixin<OrganismGroup>;

  declare getTickets: HasManyGetAssociationsMixin<Ticket>; // Note the null assertions!
  declare countTickets: HasManyCountAssociationsMixin;
  declare hasTicket: HasManyHasAssociationMixin<Ticket, Ticket["id"]>;
  declare hasTickets: HasManyHasAssociationsMixin<Ticket, Ticket["id"]>;
  declare setTickets: HasManySetAssociationsMixin<Ticket, Ticket["id"]>;
  declare addTicket: HasManyAddAssociationMixin<Ticket, Ticket["id"]>;
  declare addTickets: HasManyAddAssociationsMixin<Ticket, Ticket["id"]>;
  declare removeTicket: HasManyRemoveAssociationMixin<Ticket, Ticket["id"]>;
  declare removeTickets: HasManyRemoveAssociationsMixin<Ticket, Ticket["id"]>;
  declare createTicket: HasManyCreateAssociationMixin<Ticket, "parishId">;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare tickets?: NonAttribute<Ticket[]>;

  declare static associations: {
    tickets: Association<Organism, Ticket>;
  };
}

Organism.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    name: {
      singular: "organism",
      plural: "organisms",
    },
    tableName: "organisms",
    timestamps: false,
    paranoid: true,
  }
);