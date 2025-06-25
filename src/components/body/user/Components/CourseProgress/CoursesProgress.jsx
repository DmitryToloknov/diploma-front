import classes from "./CoursesProgress.module.css";
import CourseProgress from "./CourseProgress.jsx";

export default function CoursesProgress({ data }) {
    return (
        <div className={classes.coursesProgress}>
            {data.map((course) => (
                <CourseProgress
                    key={course.id}
                    id={course.id}
                    estimation={course.estimation}
                    estimationActual={course.estimationActual}
                    name={course.name}
                />
            ))}
        </div>
    );
}
