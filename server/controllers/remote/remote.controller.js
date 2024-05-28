import { ElementNotFound } from "../../Utils/appError.js";
import { AppError } from "../../Utils/appError.js";
import Remote from "../../models/RemoteWork/Remote.model.js";
import {getAllRemotesByEmail, getAllRemotes, getUserByEmail} from "./lib.js";
import {Intervenant, Leave, Project, User} from "../../db/relations.js";
import moment from "moment";
import {Op} from "sequelize";
import UserProfile from "../../models/users/UserProfile.model.js";

export const createRemoteWork = async (req, res, next) => {
  try {
    const { reference, remoteDate, status,userID } = req.body;
    const newRemoteWork = await Remote.create({ reference, remoteDate, status,userID });
    res.status(201).json({ remoteWork: newRemoteWork });
  } catch (error) {
    next(error);
  }
};

export const getRemoteWorkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const remoteWork = await Remote.findByPk(id);
    if (!remoteWork) {
      throw new ElementNotFound("Remote work not found");
    }
    res.status(200).json({ remoteWork });
  } catch (error) {
    next(error);
  }
};

export const updateRemoteWork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reference, remoteDate, status,userID } = req.body;

    const remoteWork = await Remote.findByPk(id);
    if (!remoteWork) {
      throw new ElementNotFound("Remote work not found");
    }

    await remoteWork.update({ reference, remoteDate, status,userID });
    res.status(200).json({ remoteWork });
  } catch (error) {
    next(error);
  }
};

export const deleteRemoteWork = async (req, res, next) => {
  try {
    const { remoteWorkId } = req.params;
    const remoteWork = await Remote.findByPk(remoteWorkId);
    if (!remoteWork) {
      throw new ElementNotFound("Remote work not found");
    }
    await remoteWork.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getAllRemoteWorksController = async (req, res, next) => {
  try {
    const remoteWorks = await getAllRemotes();
    if (!remoteWorks || remoteWorks.length === 0) {
      throw new ElementNotFound("No remote works found");
    }
    res.status(200).json({ remoteWorks });
  } catch (error) {
    next(error);
  }
};

export const getAllRemoteWorksByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("An email must be provided", 500));

    const remoteWorks = await getAllRemotesByEmail(email);

    res.status(200).json({ remoteWorks });
  } catch (error) {
    next(error);
  }
};

export const getStatusOfEmployees = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("An email must be provided", 500));

    // Retrieve the user by email to get the corresponding userID
    const userManager = await getUserByEmail(email);
    if (!userManager) {
      return []; // Return an empty array if user is not found
    }
    const today = moment().startOf('day');

    // Fetch all projects managed by this manager
    const projects = await Project.findAll({
      where: { manager: userManager.id }
    });

    // Extract project IDs
    const projectIds = projects.map(project => project.id);

    // Fetch all intervenants related to these projects
    const intervenants = await Intervenant.findAll({
      where: { projectID: { [Op.in]: projectIds } }
    });

    // Extract unique user IDs
    const userIds = [...new Set(intervenants.map(intervenant => intervenant.intervenantID))];
    console.log(today.toDate());

    // Fetch users
    const employees = await User.findAll({
      where: { id: { [Op.in]: userIds } }
    });
    const employeeStatuses = await Promise.all(employees.map(async (employee) => {
      const leave = await Leave.findOne({
        where: {
          userID: employee.id,
          status: 'Accepté',
          dateDebut: { [Op.lte]: today.toDate() },
          dateFin: { [Op.gte]: today.toDate() }
        }
      });
      const remote = await Remote.findOne({
        where: {
          userID: employee.id,
          status : 'Accepté',
          remoteDate: { [Op.and]:
            [
              { [Op.gte]: today.toDate() },
              { [Op.lt]: moment(today).add(1, 'days').toDate() }
            ]
          }
        }
      });
      const username = await UserProfile.findOne({where: {userID: employee.id}});
      return {
        email: `${employee.email}`,
        employeeName: `${username.name} ${username.lastName}`,
        status: leave ? 'Conge' : (remote ? 'Home Office' : 'In Office')
      };
    }));

    res.status(200).json({ employeeStatuses });
  } catch (error) {
    console.error(`Error retrieving employee statuses: ${error.message}`);
    throw new Error(`Error retrieving employee statuses: ${error.message}`);
  }
};

export const getUserProjects = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("An email must be provided", 500));

    // Retrieve the user by email to get the corresponding userID
    const userManager = await getUserByEmail(email);
    if (!userManager) {
      return []; // Return an empty array if user is not found
    }

    // Fetch all projects managed by this manager
    const projects = await Project.findAll({
      where: { manager: userManager.id }
    });

    if (!projects || projects.length === 0) {
      throw new ElementNotFound("No projects found for this user");
    }

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};
