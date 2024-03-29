<?php

namespace App\Http\Controllers;

use App\Exceptions\ExceptionMessages;
use App\Http\Requests\PatientComment\PatientCommentRequest;
use App\Manager\UserSpecificGenericManager;
use App\Manager\GenericManager;
use App\Models\Patient_doctor_request;
use App\Models\Patients_comment;
use App\Models\User;
use App\Models\Doctors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PatientCommentController extends Controller
{
    //
    protected $user, $patient_comment, $userSpecificGenericManager ; 

    public function __construct(){
        $this->user = Auth::user();
        $this->patient_comment = new Patients_comment();
        $this->userSpecificGenericManager = new UserSpecificGenericManager($this->patient_comment );
    }

    // public function getPatientComment($id){
    //     return $this->userSpecificGenericManager->findById($id, "patient_id");   
    // }

    public function getCommentsCounts($id){
        return $this->patient_comment->where('doctor_id', $id)->count();
    }

    public function getAllPatientCommentForDoctor($id, Request $request){
        $perPage = $request->input('perPage');
        $perPage = $perPage ?? 10;

        $data = $this->patient_comment->with(['doctor', 'user'])->where('doctor_id', $id)
            ->paginate($perPage);
    return response()->json(['data' => $data]);
    }

    public function createPatientComment(Request $request){
        try{
            $validationResponse = PatientCommentRequest::createPatientCommentValidation($request);
            $responseData = json_decode($validationResponse->getContent(), true);
        
            if($responseData['status'] != "success"){
                return $responseData['errors'];
            }

            $genericManager = new GenericManager(new Doctors); 
            $data = $request->json()->all();
            $doctorObj = $genericManager->findById($data['doctor_id']);
            if(!$doctorObj){
                return ExceptionMessages::NotFound("Doctor");
            }
            
            $patientRequestDoctor = new Patient_doctor_request();
            $patientRequestDoctorObj = $patientRequestDoctor->where('patient_id', $this->user->id)
                                                            ->where('doctor_id', $data['doctor_id'])
                                                            ->where('request','accepted');
            if(!$patientRequestDoctorObj){
                return ExceptionMessages::Error('Unauthirized to comment', 403);
            }                 
            
            return $this->userSpecificGenericManager->createWithSpecificUser($request);
        }catch(\Exception $exception){
            return ExceptionMessages::Error($exception->getMessage());
        }
    }

    public function updatePatientComment($id ,Request $request){
        try{
            $validationResponse = PatientCommentRequest::updatePatientCommentValidation($request);
            $responseData = json_decode($validationResponse->getContent(), true);
        
            if($responseData['status'] != "success"){
                return $responseData['errors'];
            }
            
            if ($request->has('doctor_id')) {
                $data = $request->except(['doctor_id']);
                $request->replace($data);
            }
            return $this->userSpecificGenericManager->updateForSpecificUser($request, $id, "patient_id");
        }catch(\Exception $exception){
            return ExceptionMessages::Error($exception->getMessage());
        }
    }

    public function deletePatientComment($id){
        return $this->userSpecificGenericManager->deleteForSpecificUser($id, "patient_id");
    }
}
