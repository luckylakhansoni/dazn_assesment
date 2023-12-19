import { Request, Response } from 'express';
import { Movie, MovieInput } from '../models/movie.models';
import { Message, statusCode } from "../constant";

async function isLink(input) {
    // Regular expression for a simple URL pattern
    const urlPattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;
    // Test the input against the pattern
    return urlPattern.test(input);
}
const createMovie = async (req: Request, res: Response) => {
    try {
        if (req.body.isAdmin) {
            const { title, genre, rating, streamLink } = req.body;
            const input: MovieInput = {
                title,
                genre,
                rating,
                streamLink
            };
            let isvalidLink = await isLink(streamLink)
            if (!isvalidLink) {
                res.status(statusCode.BadReq).json({
                    message: Message.URL
                })
                return
            }
            await Movie.create(input);
            res.status(statusCode.Created).json({ data: Message.videoCreate });
        } else {
            res.status(statusCode.unauthrised).json({
                message: Message.adminAccess,
            })
            return
        }
    } catch (error: any) {
        res.status(statusCode.serverSideError).json({ message: error.message })
    }

};
const getAllMovie = async (req: Request, res: Response) => {
    try {
        const getAllData = await Movie.find().sort('-createdAt').exec();
        return res.status(statusCode.success).json({ data: getAllData });
    } catch (error: any) {
        res.status(statusCode.serverSideError).json({ message: error.message })
    }
};
const getMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const dataObject = await Movie.findOne({ _id: id });

        if (!dataObject) {
            return res.status(statusCode.BadReq).json({ message: Message.dataNotFound });
        }
        return res.status(statusCode.success).json({ data: dataObject });
    } catch (error: any) {
        res.status(statusCode.serverSideError).json({ message: error.message })
    }
};
const updateMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dataObject = await Movie.findOne({ _id: id });
        if (!dataObject) {
            return res.status(statusCode.BadReq).json({ message: Message.dataNotFound });
        }
        await Movie.updateOne({ _id: id }, req.body);
        return res.status(statusCode.success).json({ data: Message.dataUpdated });
    } catch (error: any) {
        res.status(statusCode.serverSideError).json({ message: error.message })

    }
};

const deleteMovie = async (req: Request, res: Response) => {
    try {
        let isAdmin = req.query.isAdmin as unknown as any
        if (isAdmin == true || isAdmin == 'true') {
            const { id } = req.params;
            await Movie.findByIdAndDelete(id);
            return res.status(statusCode.success).json({ data: Message.dataDeleted });
        }
        else {
            res.status(statusCode.BadReq).json({
                message: Message.adminAccess
            })
            return
        }
    } catch (error: any) {

        console.log(error.message)
        res.status(statusCode.serverSideError).json({ message: error.message })
    }
};

const searchMovies = async (req: Request, res: Response) => {
    try {
        // Build the search query with multiple fields
        const searchQuery: { [key: string]: any } = {};
        searchQuery.$or = []

        if (req.query.title) {
            searchQuery.$or.push({ title: { $regex: new RegExp(req.query.title as string, 'i') } });
        }

        if (req.query.genre) {
            searchQuery.$or.push({ genre: { $regex: new RegExp(req.query.genre as string, 'i') } });
        }
        const results = await Movie.find(searchQuery);
        return res.send({ data: results });
    } catch (error: any) {
        res.status(statusCode.serverSideError).json({ message: error.message })
    }
};


export { createMovie, deleteMovie, getAllMovie, getMovie, updateMovie, searchMovies };