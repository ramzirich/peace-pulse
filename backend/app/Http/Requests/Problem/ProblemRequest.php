<?php

namespace App\Http\Requests\PatientComment;
use Illuminate\Validation\ValidationException;

class PatientCommentRequest{
    public static function createPatientCommentValidation($request){
        try{
            $request->validate([
                "user_id" => "required|numeric",
                "problem" => "required|string",
                "solution" => "required|string",
                "action" => "required|string",
                "ai_solution" => "required|string",
                "severity" => "required|numeric",
            ],[
                "doctor_id.required" => "The Doctor id field is required",
                "doctor_id.numeric" => "The Doctor id field must be a number",
                "comment.required" => "The Comment field is required",
                "comment.numeric" => "The Comment field must be a number",
            ]);
            return response()->json([
                'status' => "success"
            ]);
        }catch (ValidationException $exception) {
            return response()->json([
                'status' => "error",
                'errors' => $exception->errors()
            ], 422);
        }
    }

    public static function updatePatientCommentValidation($request){
        try{
            $request->validate([
                "comment" => "string"
            ],[
                "comment.string" => "The Comment field must be a number",
            ]);
            return response()->json([
                'status' => "success"
            ]);
        }catch (ValidationException $exception) {
            return response()->json([
                'status' => "error",
                'errors' => $exception->errors()
            ], 422);
        }
    }
}